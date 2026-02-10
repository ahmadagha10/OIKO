import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Hr,
} from '@react-email/components';

interface OrderItem {
  product: {
    name: string;
    price: number;
  };
  size: string;
  color: string;
  quantity: number;
}

interface OrderConfirmationEmailProps {
  orderRef: string;
  customerName: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  pointsEarned: number;
}

export default function OrderConfirmationEmail({
  orderRef,
  customerName,
  items,
  subtotal,
  shipping,
  total,
  pointsEarned,
}: OrderConfirmationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your OIKO order #{orderRef} is confirmed!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Order Confirmed!</Heading>
          <Text style={text}>Hi {customerName},</Text>
          <Text style={text}>
            Thank you for your order! We're preparing your items and will notify
            you when they ship.
          </Text>

          <Section style={orderBox}>
            <Text style={orderRefStyle}>Order #{orderRef}</Text>

            <Hr style={hr} />

            {items.map((item, index) => (
              <Section key={index} style={itemRow}>
                <Text style={itemName}>
                  {item.product.name} × {item.quantity}
                </Text>
                <Text style={itemDetails}>
                  {item.size} • {item.color}
                </Text>
                <Text style={itemPrice}>
                  ${(item.product.price * item.quantity).toFixed(2)}
                </Text>
              </Section>
            ))}

            <Hr style={hr} />

            <Section style={totalsSection}>
              <Section style={totalRow}>
                <Text style={totalLabel}>Subtotal:</Text>
                <Text style={totalValue}>${subtotal.toFixed(2)}</Text>
              </Section>
              <Section style={totalRow}>
                <Text style={totalLabel}>Shipping:</Text>
                <Text style={totalValue}>${shipping.toFixed(2)}</Text>
              </Section>
              <Section style={totalRow}>
                <Text style={totalLabelBold}>Total:</Text>
                <Text style={totalValueBold}>${total.toFixed(2)}</Text>
              </Section>
            </Section>
          </Section>

          {pointsEarned > 0 && (
            <Section style={rewardsBox}>
              <Text style={rewardsText}>
                🎁 You earned {pointsEarned} Fragment Points!
              </Text>
              <Link style={rewardsLink} href={`${process.env.NEXT_PUBLIC_API_URL}/rewards`}>
                View Rewards
              </Link>
            </Section>
          )}

          <Section style={buttonContainer}>
            <Link style={button} href={`${process.env.NEXT_PUBLIC_API_URL}/account`}>
              Track Your Order
            </Link>
          </Section>

          <Text style={footer}>
            © {new Date().getFullYear()} OIKO. All rights reserved.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '40px 20px',
  maxWidth: '560px',
};

const h1 = {
  color: '#0a0e1a',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0 0 20px',
};

const text = {
  color: '#334155',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0 0 16px',
};

const orderBox = {
  backgroundColor: '#f8fafc',
  borderRadius: '8px',
  padding: '24px',
  margin: '24px 0',
};

const orderRefStyle = {
  fontSize: '14px',
  fontWeight: 'bold',
  color: '#64748b',
  margin: '0 0 16px',
};

const hr = {
  borderColor: '#e2e8f0',
  margin: '16px 0',
};

const itemRow = {
  marginBottom: '12px',
};

const itemName = {
  fontSize: '16px',
  fontWeight: 'bold',
  color: '#0a0e1a',
  margin: '0 0 4px',
};

const itemDetails = {
  fontSize: '14px',
  color: '#64748b',
  margin: '0 0 4px',
};

const itemPrice = {
  fontSize: '16px',
  color: '#0a0e1a',
  margin: '0',
};

const totalsSection = {
  marginTop: '16px',
};

const totalRow = {
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: '8px',
};

const totalLabel = {
  fontSize: '16px',
  color: '#64748b',
  margin: '0',
};

const totalValue = {
  fontSize: '16px',
  color: '#0a0e1a',
  margin: '0',
};

const totalLabelBold = {
  fontSize: '18px',
  fontWeight: 'bold',
  color: '#0a0e1a',
  margin: '0',
};

const totalValueBold = {
  fontSize: '18px',
  fontWeight: 'bold',
  color: '#0a0e1a',
  margin: '0',
};

const rewardsBox = {
  backgroundColor: '#f0f9ff',
  border: '2px solid #3b82f6',
  borderRadius: '8px',
  padding: '16px',
  textAlign: 'center' as const,
  margin: '24px 0',
};

const rewardsText = {
  fontSize: '16px',
  fontWeight: 'bold',
  color: '#0a0e1a',
  margin: '0 0 12px',
};

const rewardsLink = {
  color: '#3b82f6',
  fontSize: '14px',
  textDecoration: 'none',
};

const buttonContainer = {
  margin: '32px 0',
  textAlign: 'center' as const,
};

const button = {
  backgroundColor: '#0a0e1a',
  borderRadius: '8px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 32px',
};

const footer = {
  color: '#94a3b8',
  fontSize: '14px',
  lineHeight: '20px',
  marginTop: '32px',
  textAlign: 'center' as const,
};
