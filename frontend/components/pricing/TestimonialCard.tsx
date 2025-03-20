import { function as Image } from 'next/image';

interface TestimonialCardProps {
  quote: string;
  author: string;
  role: string;
  imageUrl: string;
}

export function TestimonialCard({ quote, author, role, imageUrl }: TestimonialCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="relative h-8 mb-4">
        <Image
          src="/images/quote-mark.svg"
          alt="Quote"
          fill
          style={{ objectFit: 'contain', objectPosition: 'left' }}
        />
      </div>
      <p className="text-gray-600 italic mb-4">{quote}</p>
      <div className="flex items-center mt-4">
        <div className="flex-shrink-0">
          <div className="h-10 w-10 rounded-full overflow-hidden relative">
            <Image
              src={imageUrl}
              alt={author}
              fill
              style={{ objectFit: 'cover' }}
            />
          </div>
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium text-gray-900">{author}</p>
          <p className="text-xs text-gray-500">{role}</p>
        </div>
      </div>
    </div>
  );
} 