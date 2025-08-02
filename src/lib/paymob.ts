// Paymob Payment Integration
export interface PaymobConfig {
  apiKey: string;
  integrationId: string;
  iframeId: string;
  hmacSecret: string;
}

export interface PaymentRequest {
  amount: number;
  currency: string;
  orderId: string;
  userId: string;
  sellerId?: string;
  commissionRate?: number;
  billingData: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    apartment?: string;
    floor?: string;
    street?: string;
    building?: string;
    shippingMethod?: string;
    postalCode?: string;
    city?: string;
    country?: string;
    state?: string;
  };
}

export interface PaymentResponse {
  success: boolean;
  paymentToken?: string;
  iframeUrl?: string;
  error?: string;
  transactionId?: string;
}

class PaymobService {
  private config: PaymobConfig;
  private baseUrl = 'https://accept.paymob.com/api';

  constructor(config: PaymobConfig) {
    this.config = config;
  }

  // Step 1: Get authentication token
  async getAuthToken(): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/tokens`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          api_key: this.config.apiKey,
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to get auth token');
      }

      return data.token;
    } catch (error) {
      console.error('Paymob auth error:', error);
      throw error;
    }
  }

  // Step 2: Create order
  async createOrder(authToken: string, amount: number, currency: string = 'EGP'): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/ecommerce/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          auth_token: authToken,
          delivery_needed: false,
          amount_cents: Math.round(amount * 100), // Convert to cents
          currency: currency,
          items: [],
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to create order');
      }

      return data;
    } catch (error) {
      console.error('Paymob create order error:', error);
      throw error;
    }
  }

  // Step 3: Get payment key
  async getPaymentKey(
    authToken: string,
    orderId: number,
    amount: number,
    billingData: PaymentRequest['billingData']
  ): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/acceptance/payment_keys`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          auth_token: authToken,
          amount_cents: Math.round(amount * 100),
          expiration: 3600, // 1 hour
          order_id: orderId,
          billing_data: {
            apartment: billingData.apartment || 'NA',
            email: billingData.email,
            floor: billingData.floor || 'NA',
            first_name: billingData.firstName,
            street: billingData.street || 'NA',
            building: billingData.building || 'NA',
            phone_number: billingData.phoneNumber,
            shipping_method: billingData.shippingMethod || 'NA',
            postal_code: billingData.postalCode || 'NA',
            city: billingData.city || 'NA',
            country: billingData.country || 'EG',
            last_name: billingData.lastName,
            state: billingData.state || 'NA',
          },
          currency: 'EGP',
          integration_id: this.config.integrationId,
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to get payment key');
      }

      return data.token;
    } catch (error) {
      console.error('Paymob payment key error:', error);
      throw error;
    }
  }

  // Main payment processing function
  async processPayment(paymentRequest: PaymentRequest): Promise<PaymentResponse> {
    try {
      // Step 1: Get auth token
      const authToken = await this.getAuthToken();

      // Step 2: Create order
      const order = await this.createOrder(
        authToken,
        paymentRequest.amount,
        paymentRequest.currency
      );

      // Step 3: Get payment key
      const paymentKey = await this.getPaymentKey(
        authToken,
        order.id,
        paymentRequest.amount,
        paymentRequest.billingData
      );

      // Step 4: Generate iframe URL
      const iframeUrl = `https://accept.paymob.com/api/acceptance/iframes/${this.config.iframeId}?payment_token=${paymentKey}`;

      return {
        success: true,
        paymentToken: paymentKey,
        iframeUrl,
        transactionId: order.id.toString(),
      };
    } catch (error) {
      console.error('Payment processing error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Payment processing failed',
      };
    }
  }

  // Verify payment callback
  verifyCallback(callbackData: any): boolean {
    try {
      // Implement HMAC verification here
      // This is a simplified version - implement proper HMAC verification
      return callbackData.success === 'true';
    } catch (error) {
      console.error('Callback verification error:', error);
      return false;
    }
  }
}

// Initialize Paymob service
const paymobConfig: PaymobConfig = {
  apiKey: import.meta.env.VITE_PAYMOB_API_KEY || '',
  integrationId: import.meta.env.VITE_PAYMOB_INTEGRATION_ID || '',
  iframeId: import.meta.env.VITE_PAYMOB_IFRAME_ID || '',
  hmacSecret: import.meta.env.VITE_PAYMOB_HMAC_SECRET || '',
};

export const paymobService = new PaymobService(paymobConfig);

// Helper function to calculate commission
export const calculateCommission = (amount: number, rate: number = 5): number => {
  return Math.round((amount * (rate / 100)) * 100) / 100;
};

// Helper function to calculate net amount after commission
export const calculateNetAmount = (amount: number, commissionRate: number = 5): number => {
  const commission = calculateCommission(amount, commissionRate);
  return Math.round((amount - commission) * 100) / 100;
};