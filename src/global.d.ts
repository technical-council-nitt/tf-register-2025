declare module "@cashfreepayments/cashfree-js" {
  export interface CashfreeInstance {
    checkout(options: {
      paymentSessionId: string;
      redirect: boolean;
      appearance?: {
        width?: string;
        height?: string;
      };
    }): Promise<{
      error?: any;
      redirect?: boolean;
      paymentDetails?: any;
    }>;
  }
  
  export function load(options: { mode: "test" | "production" }): Promise<CashfreeInstance>;
}