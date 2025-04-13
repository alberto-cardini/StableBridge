const express = require('express');
const axios = require('axios');
const router = express.Router();
const Invoice = require('../models/invoice'); // attento: minuscolo qui
const User = require('../models/User'); // attento: minuscolo qui

router.post('/', async (req, res) => {
  try {
    const { buyerUsername } = req.body;
    const buyer = await User.findOne({ username: buyerUsername });
    if (!buyer) {
      return res.status(404).json({ error: 'Buyer user not found' });
    }

    const invoiceData = {
      ...req.body,
      buyerWallet: buyer.walletAddress, // assegna automaticamente
    };

    const invoice = new Invoice(invoiceData);
    await invoice.save();

    res.status(201).json(invoice);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// OTTIENI una fattura per ID
router.get('/:id', async (req, res) => {
  try {
    const invoice = await Invoice.findOne({ invoiceId: req.params.id });
    if (!invoice) return res.status(404).json({ error: 'Fattura non trovata' });
    res.json(invoice);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ACCEPT invoice (cambia status da "pending" a "accepted")
router.post('/:id/accept', async (req, res) => {
    console.log("chiamata approvazione per: ", req.params.id);
    try {
        const invoice = await Invoice.findOneAndUpdate(
          { invoiceId: req.params.id },
          { status: 'accepted' },
          { new: true }
        );

        if (!invoice) {
          return res.status(404).json({ error: 'Fattura non trovata' });
        }

        res.json({ message: 'Fattura accettata', invoice });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
  });

router.post('/:id/pay', async (req, res) => {
  try {
    const invoice = await Invoice.findOne({ invoiceId: req.params.id });

    if (!invoice) {
      return res.status(404).json({ error: 'Fattura non trovata' });
    }

    if (invoice.status !== 'accepted') {
      return res.status(400).json({ error: 'La fattura non è in stato accepted. Pagamento non consentito.' });
    }

    // ✅ CONTROLLA che buyerWallet esista
    if (!invoice.buyerWallet || !invoice.supplierWallet) {
      return res.status(400).json({ error: 'buyerWallet o supplierWallet mancante nella fattura' });
    }

    const buyerUser = await User.findOne({ walletAddress: invoice.buyerWallet.trim() });

    if (!buyerUser) {
      return res.status(404).json({ error: 'Utente buyer non trovato nel database' });
    }

    const seed = buyerUser.walletAddress; // ⚠️ solo se usi il wallet come seed nei test

    await axios.post("http://localhost:5001/send-payment", {
      seed,
      destination: invoice.supplierWallet.trim(),
      amount: invoice.amount,
      issuer: "rQhWct2fv4Vc4KRjRgMrxa8xPN9Zx9iLKV"
    });

    invoice.status = 'paid';
    await invoice.save();

    res.json({ message: 'Pagamento eseguito con successo', invoice });
  } catch (err) {
    console.error("Errore nel pagamento:", err);
    res.status(500).json({ error: err.message });
  }
});
  
// GET tutte le fatture
router.get('/', async (req, res) => {
  try {
    const invoices = await Invoice.find();
    res.json(invoices);
  } catch (err) {
    console.error("Errore nel recupero delle fatture:", err);
    res.status(500).json({ error: err.message });
  }
});

  

module.exports = router;
