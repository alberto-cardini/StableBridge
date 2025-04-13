from flask import Flask, request, jsonify
from xrpl.clients import JsonRpcClient
from xrpl.models import Payment, SignerEntry, SignerListSet, IssuedCurrencyAmount
from xrpl.transaction import autofill, multisign, sign, submit_and_wait
from xrpl.wallet import Wallet

app = Flask(__name__)

@app.route('/send-payment', methods=['POST'])
def send_payment():
    data = request.json

    # Fetch parameters from POST body
    seed = data.get('seed')                # From supplier (sender)
    destination = data.get('destination')  # To buyer
    amount = data.get('amount')            # Invoice amount
    issuer = data.get('issuer')            # Issuer of RLUSD
    destination = Wallet.from_seed(destination)

    if not seed or not destination or not amount or not issuer:
        return jsonify({ "error": "Missing required fields (seed, destination, amount, issuer)" }), 400

    try:
        # Setup XRPL client and wallet
        client = JsonRpcClient("https://s.altnet.rippletest.net:51234")
        wallet = Wallet.from_seed(seed)

        # Hardcoded RLUSD currency code (hex)
        currency_hex = "524C555344000000000000000000000000000000"

        # Construct payment transaction
        payment = Payment(
            account=wallet.classic_address,
            amount={
                "currency": currency_hex,
                "value": str(amount),
                "issuer": issuer
            },
            destination = "rLscKhq3Uj7sjJvQhyo6T1h1PpYF5DesBm",
        )
        # Submit transaction to XRPL
        response = submit_and_wait(payment, client, wallet)

        # Return success or failure
        if response.is_successful():

            master_wallet = Wallet.from_seed("sEd7dAkNxytQubkLodCeScN7Hg7nXyv")
            signer_entries = [
                SignerEntry(account=wallet.classic_address, signer_weight=1),
                SignerEntry(account=destination.classic_address, signer_weight=1),
            ]
            signer_list_set_tx = SignerListSet(
                account=master_wallet.classic_address,
                signer_quorum=2,
                signer_entries=signer_entries,
            )
            issued_currency = IssuedCurrencyAmount(
                currency="524C555344000000000000000000000000000000",  # The currency code should be "USD" for RLUSD typically
                issuer=issuer,
                value="1")  # Amount to send, adjust as needed
            payment_tx = Payment(
                account=master_wallet.classic_address,
                destination=destination.classic_address,  # wallet2 as the destination
                amount=issued_currency
            )

            # Autofill transaction details
            autofilled_payment_tx = autofill(payment_tx, client, len(signer_entries))

            # Sign with both required signers
            tx_1 = sign(autofilled_payment_tx, wallet, multisign=True)
            tx_2 = sign(autofilled_payment_tx, destination, multisign=True)

            # Combine signatures
            multisigned_tx = multisign(autofilled_payment_tx, [tx_1, tx_2])

            print("Successfully multisigned the transaction")
            print(multisigned_tx.to_xrpl())

            # Submit multisigned transaction
            multisigned_tx_response = submit_and_wait(multisigned_tx, client)

            # Check the result
            if multisigned_tx_response.result.get("validated", False):
                signers_in_response = multisigned_tx_response.result.get("tx_json", {}).get("Signers", [])

            if multisigned_tx_response.is_successful():
                return jsonify({
                    "status": "success",
                    "hash": multisigned_tx_response.result['hash']
                })
            else:
                return jsonify({
                    "status": "failed",
                    "error": multisigned_tx_response.result.get('engine_result_message')
                }), 400
        else:
            return jsonify({
                "status": "failed",
                "error": response.result.get('engine_result_message')
            }), 400

    except Exception as e:
        return jsonify({ "error": str(e) }), 500


if __name__ == "__main__":
    app.run(port=5001)