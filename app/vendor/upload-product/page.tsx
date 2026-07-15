'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCoOp } from '../../CoOpState'; // Adjusted import path to reach your State hook

export default function VendorUploadPage() {
  const context = useCoOp();
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'General',
    description: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!context) return null;
  const { addVendorProduct } = context;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Call state context function to insert into active shop list
    addVendorProduct({
      name: formData.name,
      category: formData.category,
      price: parseFloat(formData.price),
      desc: formData.description,
      img: '📦' // Fallback emoji
    });

    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);
      setFormData({ name: '', price: '', category: 'General', description: '' });
    }, 1000);
  };

  // ... keep the exact same JSX return structure as before
}
