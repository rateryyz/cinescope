import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star } from 'lucide-react';

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rating: number, comment: string) => void;
  initialRating?: number;
  initialComment?: string;
}

export default function RatingModal({
  isOpen,
  onClose,
  onSubmit,
  initialRating = 0,
  initialComment = '',
}: RatingModalProps) {
  const [rating, setRating] = useState(initialRating);
  const [comment, setComment] = useState(initialComment);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(rating, comment);
    onClose();
  };

  const renderStars = () => {
    return [...Array(5)].map((_, index) => (
      <div
        key={index}
        className="cursor-pointer"
        onClick={() => setRating(index + 1)}
      >
        <Star
          className={`w-6 h-6 ${index < rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-400 fill-gray-400'}`}
        />
      </div>
    ));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-background rounded-lg p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-foreground">Rate & Comment</h2>
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1 text-foreground">Rating</label>
                <div className="flex gap-1">{renderStars()}</div>
                <div className="mt-2 text-center text-foreground">Rating: {rating}</div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1 text-foreground">Comment</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full p-2 rounded border border-input bg-background text-foreground h-24 resize-none"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-primary text-primary-foreground py-2 rounded hover:bg-primary/90 transition-colors"
              >
                Submit
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
