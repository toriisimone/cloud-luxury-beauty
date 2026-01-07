import { Coupon } from '../types/global';
import styles from './CouponCard.module.css';

interface CouponCardProps {
  coupon: Coupon;
  onApply?: (coupon: Coupon) => void;
}

const CouponCard = ({ coupon, onApply }: CouponCardProps) => {
  const getDiscountText = () => {
    if (coupon.type === 'PERCENTAGE') {
      return `${coupon.value}% OFF`;
    } else if (coupon.type === 'FIXED') {
      return `$${coupon.value} OFF`;
    } else {
      return 'BOGO';
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.content}>
        <div className={styles.code}>{coupon.code}</div>
        <div className={styles.discount}>{getDiscountText()}</div>
        {coupon.description && (
          <p className={styles.description}>{coupon.description}</p>
        )}
        {coupon.minPurchase && (
          <p className={styles.condition}>Min. purchase: ${coupon.minPurchase}</p>
        )}
      </div>
      {onApply && (
        <button onClick={() => onApply(coupon)} className={styles.applyBtn}>
          Apply
        </button>
      )}
    </div>
  );
};

export default CouponCard;
