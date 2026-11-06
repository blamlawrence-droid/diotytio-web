import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';

const PaymentResult = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const reference = searchParams.get('reference') || searchParams.get('payment_id');
  const [status, setStatus] = useState(reference ? 'checking' : 'error');
  const [paymentData, setPaymentData] = useState(null);

  useEffect(() => {
    if (!reference) return;
    let cancelled = false;
    let timer;
    const checkPayment = async () => {
      try {
        const response = await fetch(`/api/payments/${encodeURIComponent(reference)}`);
        const data = await response.json();

        if (cancelled) return;
        if (response.ok && data.data) {
          setPaymentData(data.data);
          setStatus(data.data.status === 'paid' ? 'success' : data.data.status === 'pending' ? 'pending' : 'error');
          if (data.data.status === 'pending') timer = setTimeout(checkPayment, 5000);
        } else {
          setStatus('error');
        }
      } catch {
        if (!cancelled) setStatus('error');
      }
    };

    checkPayment();
    return () => { cancelled = true; clearTimeout(timer); };
  }, [reference]);

  if (status === 'checking') {
    return (
      <div className="container animate-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', padding: '20px', textAlign: 'center' }}>
        <Loader2 size={48} className="animate-spin" color="var(--primary)" />
        <h2 style={{ fontSize: '22px', marginTop: '20px' }}>Vérification du paiement...</h2>
        <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>Veuillez patienter</p>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="container animate-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', padding: '20px', textAlign: 'center' }}>
        <CheckCircle2 size={64} color="var(--success)" />
        <h2 style={{ fontSize: '24px', marginTop: '20px', color: 'var(--success)' }}>Paiement réussi !</h2>
        <p style={{ color: 'var(--text-secondary)', marginTop: '8px', maxWidth: '300px' }}>
          Votre dépôt de {paymentData?.amount?.toLocaleString('fr-FR')} FCFA a été confirmé.
        </p>
        {paymentData?.reference && (
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '12px' }}>
            Référence : {paymentData.reference}
          </p>
        )}
        <button onClick={() => navigate('/')} className="btn-primary" style={{ marginTop: '30px', width: '100%', maxWidth: '300px' }}>
          Retour à l'accueil
        </button>
      </div>
    );
  }

  if (status === 'pending') {
    return (
      <div className="container animate-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', padding: '20px', textAlign: 'center' }}>
        <Loader2 size={64} color="var(--primary)" className="animate-spin" />
        <h2 style={{ fontSize: '24px', marginTop: '20px' }}>Paiement en cours...</h2>
        <p style={{ color: 'var(--text-secondary)', marginTop: '8px', maxWidth: '300px' }}>
          Confirmez le paiement sur votre téléphone. La page se met à jour automatiquement.
        </p>
        <button onClick={() => navigate('/')} style={{ marginTop: '30px', padding: '16px', background: 'transparent', color: 'var(--text-secondary)', fontWeight: '600' }}>
          Retour à l'accueil
        </button>
      </div>
    );
  }

  return (
    <div className="container animate-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', padding: '20px', textAlign: 'center' }}>
      <XCircle size={64} color="var(--danger)" />
      <h2 style={{ fontSize: '24px', marginTop: '20px', color: 'var(--danger)' }}>Paiement échoué</h2>
      <p style={{ color: 'var(--text-secondary)', marginTop: '8px', maxWidth: '300px' }}>
        Le paiement n'a pas pu être traité. Veuillez réessayer.
      </p>
      <button onClick={() => navigate('/deposit')} className="btn-primary" style={{ marginTop: '30px', width: '100%', maxWidth: '300px' }}>
        Réessayer
      </button>
      <button onClick={() => navigate('/')} style={{ marginTop: '12px', padding: '16px', background: 'transparent', color: 'var(--text-secondary)', fontWeight: '600' }}>
        Retour à l'accueil
      </button>
    </div>
  );
};

export default PaymentResult;
