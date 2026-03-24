import React, { useState, useEffect } from 'react';
import { X, MessageCircle, Facebook, Instagram, Link, Check } from 'lucide-react';
import { Campaign } from '../types';
import { generateCampaignShareData, shareToWhatsApp, shareToFacebook, shareToInstagram, copyToClipboard } from '../utils/campaignShareHelpers';

interface CampaignShareModalProps {
  campaign: Campaign;
  isOpen: boolean;
  onClose: () => void;
}

export default function CampaignShareModal({ campaign, isOpen, onClose }: CampaignShareModalProps) {
  const [copiedType, setCopiedType] = useState<'link' | 'instagram' | null>(null);
  const shareData = generateCampaignShareData(campaign);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleWhatsAppShare = () => {
    shareToWhatsApp(campaign.id, shareData.encodedMessage);
  };

  const handleFacebookShare = () => {
    shareToFacebook(campaign.id, shareData.shareUrl);
  };

  const handleInstagramShare = async () => {
    try {
      await copyToClipboard(campaign.id, shareData.message);
      shareToInstagram(campaign.id);
      setCopiedType('instagram');
      setTimeout(() => setCopiedType(null), 3000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleCopyLink = async () => {
    try {
      await copyToClipboard(campaign.id, shareData.shareUrl);
      setCopiedType('link');
      setTimeout(() => setCopiedType(null), 3000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={onClose}
      />

      <div
        className={`fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 transition-transform duration-300 ease-out ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
        style={{ maxHeight: '80vh' }}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Share Campaign</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleWhatsAppShare}
              className="w-full flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium text-gray-900">WhatsApp</p>
                <p className="text-sm text-gray-500">Share via WhatsApp</p>
              </div>
            </button>

            <button
              onClick={handleFacebookShare}
              className="w-full flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Facebook className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium text-gray-900">Facebook</p>
                <p className="text-sm text-gray-500">Share on Facebook</p>
              </div>
            </button>

            <button
              onClick={handleInstagramShare}
              className="w-full flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                <Instagram className="w-6 h-6 text-pink-600" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium text-gray-900">Instagram</p>
                <p className="text-sm text-gray-500">
                  {copiedType === 'instagram' ? 'Message copied!' : 'Copy message for Instagram'}
                </p>
              </div>
              {copiedType === 'instagram' && (
                <Check className="w-5 h-5 text-green-600" />
              )}
            </button>

            <button
              onClick={handleCopyLink}
              className="w-full flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <Link className="w-6 h-6 text-gray-600" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium text-gray-900">Copy Link</p>
                <p className="text-sm text-gray-500">
                  {copiedType === 'link' ? 'Link copied!' : 'Copy campaign link'}
                </p>
              </div>
              {copiedType === 'link' && (
                <Check className="w-5 h-5 text-green-600" />
              )}
            </button>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-xl">
            <p className="text-xs font-medium text-gray-500 mb-2">Preview:</p>
            <p className="text-sm text-gray-700 whitespace-pre-line">{shareData.message}</p>
          </div>
        </div>
      </div>
    </>
  );
}
