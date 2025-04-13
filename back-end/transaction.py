from flask import Flask, request, jsonify
from xrpl.clients import JsonRpcClient
from xrpl.models.transactions import Payment
from xrpl.transaction import submit_and_wait
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
    destination = Wallet.from_seed(destination).classic_address

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
            destination=destination
        )

        # Submit transaction to XRPL
        response = submit_and_wait(payment, client, wallet)

        # Return success or failure
        if response.is_successful():
            return jsonify({
                "status": "success",
                "hash": response.result['hash']
            })
        else:
            return jsonify({
                "status": "failed",
                "error": response.result.get('engine_result_message')
            }), 400

    except Exception as e:
        return jsonify({ "error": str(e) }), 500


if __name__ == "__main__":
    app.run(port=5001)