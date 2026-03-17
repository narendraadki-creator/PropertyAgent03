import { useState } from 'react';
import { SocialPlatform } from '../types';
import { Facebook, Twitter, Linkedin, MessageCircle, Instagram, Share2, Copy, QrCode, Check } from 'lucide-react';
import {
  getPlatformShareUrl,
  openShareWindow,
  copyToClipboard,
  canUseNativeShare,
  shareViaNavigator,
  getPlatformColor,
  generateQRCode
} from '../utils/socialMediaHelpers';

interface SocialMediaShareButtonProps {
  content: string;
  url?: string;
  hashtags?: string[];
  platforms?: SocialPlatform[];
  title?: string;
  onShare?: (platform: SocialPlatform) => void;
}

export default function SocialMediaShareButton({
  content,
  url,
  hashtags,
  platforms = ['facebook', 'instagram', 'twitter', 'linkedin', 'whatsapp'],
  title,
  onShare
}: SocialMediaShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  const getPlatformIcon = (platform: SocialPlatform) => {
    const iconProps = { className: 'w-5 h-5' };
    switch (platform) {
      case 'facebook':
        return <Facebook {...iconProps} />;
      case 'twitter':
        return <Twitter {...iconProps} />;
      case 'linkedin':
        return <Linkedin {...iconProps} />;
      case 'whatsapp':
        return <MessageCircle {...iconProps} />;
      case 'instagram':
        return <Instagram {...iconProps} />;
      default:
        return <Share2 {...iconProps} />;
    }
  };

  const getPlatformName = (platform: SocialPlatform) => {
    const names: Record<SocialPlatform, string> = {
      facebook: 'Facebook',
      twitter: 'Twitter',
      linkedin: 'LinkedIn',
      whatsapp: 'WhatsApp',
      instagram: 'Instagram',
      other: 'Other'
    };
    return names[platform];
  };

  const handleShare = (platform: SocialPlatform) => {
    if (platform === 'instagram') {
      handleCopyContent();
      alert('Content copied! Instagram doesn\'t support direct sharing. Please paste the content manually in Instagram app.');
      return;
    }

    const shareUrl = getPlatformShareUrl({
      platform,
      url,
      text: content,
      hashtags
    });

    if (shareUrl) {
      openShareWindow(shareUrl, platform);
      if (onShare) {
        onShare(platform);
      }
    }
  };

  const handleCopyContent = async () => {
    const textToCopy = hashtags ? `${content}\n\n${hashtags.join(' ')}` : content;
    const success = await copyToClipboard(textToCopy);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleNativeShare = async () => {
    if (canUseNativeShare()) {
      const shared = await shareViaNavigator({
        title: title || 'Check this out!',
        text: content,
        url: url
      });

      if (shared && onShare) {
        onShare('other');
      }
    }
  };

  const handleShowQR = async () => {
    if (url) {
      const qrUrl = await generateQRCode(url);
      setQrCodeUrl(qrUrl);
      setShowQR(true);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {platforms.map((platform) => (
          <button
            key={platform}
            onClick={() => handleShare(platform)}
            className="flex flex-col items-center justify-center gap-2 p-4 border border-gray-300 rounded-lg hover:border-gray-400 hover:shadow-md transition-all group"
            style={{
              borderColor: `${getPlatformColor(platform)}20`
            }}
          >
            <div
              className="p-2 rounded-full transition-colors"
              style={{
                backgroundColor: `${getPlatformColor(platform)}10`,
                color: getPlatformColor(platform)
              }}
            >
              {getPlatformIcon(platform)}
            </div>
            <span className="text-xs font-medium text-gray-700 group-hover:text-gray-900">
              {getPlatformName(platform)}
            </span>
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleCopyContent}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-green-600">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-5 h-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Copy Content</span>
            </>
          )}
        </button>

        {url && (
          <button
            onClick={handleShowQR}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <QrCode className="w-5 h-5 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">QR Code</span>
          </button>
        )}

        {canUseNativeShare() && (
          <button
            onClick={handleNativeShare}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
          >
            <Share2 className="w-5 h-5" />
            <span className="text-sm font-medium">Share</span>
          </button>
        )}
      </div>

      {showQR && qrCodeUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
              Scan QR Code to Visit
            </h3>
            <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4">
              <img src={qrCodeUrl} alt="QR Code" className="w-full h-auto" />
            </div>
            <p className="text-sm text-gray-600 text-center mb-4">
              Scan this QR code with your phone camera to open the link
            </p>
            <button
              onClick={() => setShowQR(false)}
              className="w-full px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
