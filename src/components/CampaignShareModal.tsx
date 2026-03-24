import React, { useState, useEffect } from 'react';
import { X, MessageCircle, Facebook, Instagram, Link, Check, Linkedin, Twitter, Mail } from 'lucide-react';
import { Campaign, SocialPlatform } from '../types';
import {
  generateCampaignShareData,
  shareToWhatsApp,
  shareToFacebook,
  shareToInstagram,
  shareToLinkedIn,
  shareToTwitter,
  shareToEmail,
  copyToClipboard
} from '../utils/campaignShareHelpers';

interface CampaignShareModalProps {
  campaign: Campaign;
  isOpen: boolean;
  onClose: () => void;
}

interface PlatformConfig {
  id: SocialPlatform;
  name: string;
  icon: React.ReactNode;
  bgColor: string;
  iconColor: string;
  action: () => void;
  showCopiedState?: boolean;
}

export default function CampaignShareModal({ campaign, isOpen, onClose }: CampaignShareModalProps) {
  const [copiedType, setCopiedType] = useState<SocialPlatform | 'copy_link' | null>(null);
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

  const handleLinkedInShare = () => {
    shareToLinkedIn(campaign.id, shareData.shareUrl);
  };

  const handleTwitterShare = () => {
    shareToTwitter(campaign.id, shareData.message, shareData.shareUrl);
  };

  const handleEmailShare = () => {
    shareToEmail(campaign.id, campaign.title, shareData.message);
  };

  const handleCopyLink = async () => {
    try {
      await copyToClipboard(campaign.id, shareData.shareUrl);
      setCopiedType('copy_link');
      setTimeout(() => setCopiedType(null), 3000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const platformConfigs: PlatformConfig[] = [
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      icon: <MessageCircle className="w-6 h-6" />,
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600',
      action: handleWhatsAppShare
    },
    {
      id: 'facebook',
      name: 'Facebook',
      icon: <Facebook className="w-6 h-6" />,
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600',
      action: handleFacebookShare
    },
    {
      id: 'instagram',
      name: 'Instagram',
      icon: <Instagram className="w-6 h-6" />,
      bgColor: 'bg-pink-100',
      iconColor: 'text-pink-600',
      action: handleInstagramShare,
      showCopiedState: true
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      icon: <Linkedin className="w-6 h-6" />,
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-700',
      action: handleLinkedInShare
    },
    {
      id: 'twitter',
      name: 'Twitter',
      icon: <Twitter className="w-6 h-6" />,
      bgColor: 'bg-sky-100',
      iconColor: 'text-sky-600',
      action: handleTwitterShare
    }
  ];

  const availablePlatforms = campaign.targetPlatforms && campaign.targetPlatforms.length > 0
    ? platformConfigs.filter(config => campaign.targetPlatforms.includes(config.id))
    : platformConfigs;

  if (availablePlatforms.length === 1 && !isOpen) {
    availablePlatforms[0].action();
    return null;
  }

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
            {availablePlatforms.map((platform) => (
              <button
                key={platform.id}
                onClick={platform.action}
                className="w-full flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div className={`w-12 h-12 ${platform.bgColor} rounded-full flex items-center justify-center ${platform.iconColor}`}>
                  {platform.icon}
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-gray-900">{platform.name}</p>
                  <p className="text-sm text-gray-500">
                    {platform.showCopiedState && copiedType === platform.id
                      ? 'Content copied. Paste on Instagram'
                      : `Share ${platform.id === 'instagram' ? 'via' : 'on'} ${platform.name}`}
                  </p>
                </div>
                {platform.showCopiedState && copiedType === platform.id && (
                  <Check className="w-5 h-5 text-green-600" />
                )}
              </button>
            ))}

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
                  {copiedType === 'copy_link' ? 'Link copied!' : 'Copy campaign link'}
                </p>
              </div>
              {copiedType === 'copy_link' && (
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
