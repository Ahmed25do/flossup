flossup
# Paymob Payment Integration

## Overview
This project integrates with Paymob's payment API to:
- Generate an authentication token.
- Create an order.
- Retrieve a payment key for secure transactions.

## Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/youssefh848/Paymob-integration.git

## .env
- PAYMOB_API_KEY=your_api_key_here
- PAYMOB_INTEGRATION_ID=your_integration_id_here

## How to Use
- Use getAuthToken to retrieve the Paymob authentication token.
- Call createOrder with the required parameters.
- Use getPaymentKey to obtain the payment key for transactions.