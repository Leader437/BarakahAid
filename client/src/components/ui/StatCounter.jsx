// StatCounter Component with animation
import React from 'react';
import useCountAnimation from '../../hooks/useCountAnimation';

const StatCounter = ({ value, label, duration = 2000, valueColor = 'text-white', labelColor = 'text-primary-100', size = 'md' }) => {
  // Parse the value to extract number and suffix/prefix
  const parseValue = (val) => {
    const str = val.toString();
    
    // Check for percentage
    if (str.includes('%')) {
      const num = parseFloat(str.replace('%', ''));
      return { num, suffix: '%', prefix: '' };
    }
    
    // Check for dollar sign
    if (str.includes('$')) {
      const cleanStr = str.replace('$', '');
      if (cleanStr.includes('M')) {
        const num = parseFloat(cleanStr.replace('M', ''));
        return { num, suffix: 'M', prefix: '$' };
      }
      if (cleanStr.includes('K')) {
        const num = parseFloat(cleanStr.replace('K', ''));
        return { num, suffix: 'K', prefix: '$' };
      }
      const num = parseFloat(cleanStr);
      return { num, suffix: '', prefix: '$' };
    }
    
    // Check for comma-separated numbers
    if (str.includes(',')) {
      const num = parseFloat(str.replace(/,/g, ''));
      const hasPlus = str.includes('+');
      return { num, suffix: hasPlus ? '+' : '', prefix: '', useCommas: true };
    }
    
    // Check for M (million)
    if (str.includes('M')) {
      const num = parseFloat(str.replace('M', '').replace('+', ''));
      return { num, suffix: str.includes('+') ? 'M+' : 'M', prefix: '' };
    }
    
    // Check for K (thousand)
    if (str.includes('K')) {
      const num = parseFloat(str.replace('K', '').replace('+', ''));
      return { num, suffix: str.includes('+') ? 'K+' : 'K', prefix: '' };
    }
    
    // Check for plus sign
    if (str.includes('+')) {
      const num = parseFloat(str.replace('+', ''));
      return { num, suffix: '+', prefix: '' };
    }
    
    // Plain number
    const num = parseFloat(str);
    return { num, suffix: '', prefix: '' };
  };

  const { num, suffix, prefix, useCommas } = parseValue(value);
  const counter = useCountAnimation(num, duration);

  const formatNumber = (val) => {
    if (useCommas) {
      return val.toLocaleString();
    }
    return val;
  };

  const sizeClasses = {
    sm: 'text-2xl md:text-3xl',
    md: 'text-3xl md:text-4xl',
    lg: 'text-4xl md:text-5xl'
  };

  return (
    <div ref={counter.ref} className="text-center">
      <div className={`mb-2 font-bold ${valueColor} ${sizeClasses[size]}`}>
        {prefix}{formatNumber(counter.value)}{suffix}
      </div>
      <div className={`text-sm ${labelColor}`}>{label}</div>
    </div>
  );
};

export default StatCounter;
