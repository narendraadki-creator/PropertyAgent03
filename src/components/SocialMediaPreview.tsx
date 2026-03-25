import { SocialPlatform } from '../types';
import { Facebook, Twitter, Linkedin, MessageCircle, Instagram } from 'lucide-react';

const DEFAULT_CAMPAIGN_IMAGE = 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1200';

interface SocialMediaPreviewProps {
  platform: SocialPlatform;
  content: string;
  imageUrl?: string;
  projectName?: string;
}

export default function SocialMediaPreview({ platform, content, imageUrl, projectName }: SocialMediaPreviewProps) {
  const displayImage = imageUrl || DEFAULT_CAMPAIGN_IMAGE;
  const getPlatformIcon = () => {
    switch (platform) {
      case 'facebook':
        return <Facebook className="w-5 h-5 text-blue-600" />;
      case 'twitter':
        return <Twitter className="w-5 h-5 text-blue-400" />;
      case 'linkedin':
        return <Linkedin className="w-5 h-5 text-blue-700" />;
      case 'whatsapp':
        return <MessageCircle className="w-5 h-5 text-green-600" />;
      case 'instagram':
        return <Instagram className="w-5 h-5 text-pink-600" />;
      default:
        return null;
    }
  };

  const getPlatformName = () => {
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

  const renderPreview = () => {
    switch (platform) {
      case 'facebook':
        return (
          <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
            <div className="p-3 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                <div>
                  <p className="font-semibold text-sm">{projectName || 'Your Company'}</p>
                  <p className="text-xs text-gray-500">Just now · Public</p>
                </div>
              </div>
            </div>
            <div className="p-3">
              <p className="text-sm whitespace-pre-wrap">{content}</p>
            </div>
            <div className="w-full">
              <img src={displayImage} alt="Preview" className="w-full h-auto object-cover" />
            </div>
            <div className="p-3 border-t border-gray-200 flex gap-4 text-gray-500 text-sm">
              <button className="flex-1 hover:bg-gray-100 py-1 rounded">Like</button>
              <button className="flex-1 hover:bg-gray-100 py-1 rounded">Comment</button>
              <button className="flex-1 hover:bg-gray-100 py-1 rounded">Share</button>
            </div>
          </div>
        );

      case 'twitter':
        return (
          <div className="border border-gray-300 rounded-2xl overflow-hidden bg-white">
            <div className="p-3">
              <div className="flex gap-3">
                <div className="w-12 h-12 bg-gray-300 rounded-full flex-shrink-0"></div>
                <div className="flex-1">
                  <div className="flex items-center gap-1 mb-1">
                    <span className="font-bold text-sm">{projectName || 'Your Company'}</span>
                    <span className="text-gray-500 text-sm">@yourcompany · now</span>
                  </div>
                  <p className="text-sm whitespace-pre-wrap mb-2">{content}</p>
                  {imageUrl && (
                    <div className="rounded-2xl overflow-hidden border border-gray-200">
                      <img src={imageUrl} alt="Preview" className="w-full h-auto object-cover" />
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="px-3 py-2 border-t border-gray-200 flex justify-around text-gray-500 text-sm">
              <button className="hover:text-blue-500">Reply</button>
              <button className="hover:text-green-500">Retweet</button>
              <button className="hover:text-red-500">Like</button>
              <button className="hover:text-blue-500">Share</button>
            </div>
          </div>
        );

      case 'linkedin':
        return (
          <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
            <div className="p-3 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                <div>
                  <p className="font-semibold text-sm">{projectName || 'Your Company'}</p>
                  <p className="text-xs text-gray-500">Just now</p>
                </div>
              </div>
            </div>
            <div className="p-3">
              <p className="text-sm whitespace-pre-wrap">{content}</p>
            </div>
            <div className="w-full">
              <img src={displayImage} alt="Preview" className="w-full h-auto object-cover" />
            </div>
            <div className="p-3 border-t border-gray-200 flex gap-4 text-gray-600 text-sm">
              <button className="hover:text-blue-600">Like</button>
              <button className="hover:text-blue-600">Comment</button>
              <button className="hover:text-blue-600">Share</button>
            </div>
          </div>
        );

      case 'instagram':
        return (
          <div className="border border-gray-300 rounded-lg overflow-hidden bg-white max-w-md mx-auto">
            <div className="p-3 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-tr from-yellow-400 via-red-500 to-pink-500 rounded-full p-0.5">
                  <div className="w-full h-full bg-white rounded-full"></div>
                </div>
                <p className="font-semibold text-sm">{projectName || 'yourcompany'}</p>
              </div>
            </div>
            {imageUrl && (
              <div className="w-full aspect-square bg-gray-100">
                <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
            <div className="p-3">
              <p className="text-sm">
                <span className="font-semibold mr-1">{projectName || 'yourcompany'}</span>
                <span className="whitespace-pre-wrap">{content}</span>
              </p>
            </div>
          </div>
        );

      case 'whatsapp':
        return (
          <div className="bg-gradient-to-b from-teal-100 to-teal-50 p-4 rounded-lg">
            <div className="bg-white rounded-lg p-3 shadow-sm max-w-md">
              <p className="text-sm whitespace-pre-wrap">{content}</p>
              {imageUrl && (
                <div className="mt-2 rounded-lg overflow-hidden">
                  <img src={imageUrl} alt="Preview" className="w-full h-auto object-cover" />
                </div>
              )}
              <p className="text-xs text-gray-500 text-right mt-1">Just now</p>
            </div>
          </div>
        );

      default:
        return (
          <div className="border border-gray-300 rounded-lg p-4 bg-white">
            <p className="text-sm whitespace-pre-wrap">{content}</p>
            {imageUrl && (
              <div className="mt-3 rounded-lg overflow-hidden">
                <img src={imageUrl} alt="Preview" className="w-full h-auto object-cover" />
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 mb-3">
        {getPlatformIcon()}
        <h3 className="font-semibold text-gray-900">{getPlatformName()} Preview</h3>
      </div>
      {renderPreview()}
      <p className="text-xs text-gray-500 text-center mt-2">
        Preview may vary from actual post appearance
      </p>
    </div>
  );
}
