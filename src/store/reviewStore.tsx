import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ReviewItem {
  exerciseId: string;
  nextReviewDate: string;
  interval: number;
  easeFactor: number;
  repetitions: number;
}

interface ReviewState {
  reviewItems: ReviewItem[];
  addReviewItem: (item: ReviewItem) => void;
  updateReviewItem: (item: ReviewItem) => void;
  getDueReviews: () => ReviewItem[];
}

const ReviewContext = createContext<ReviewState | undefined>(undefined);

export const ReviewProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [reviewItems, setReviewItems] = useState<ReviewItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from AsyncStorage on mount
  useEffect(() => {
    const loadReviews = async () => {
      try {
        const stored = await AsyncStorage.getItem('copticlingo-reviews');
        if (stored) {
          setReviewItems(JSON.parse(stored));
        }
      } catch (error) {
        console.warn('Failed to load reviews:', error);
      } finally {
        setIsLoaded(true);
      }
    };
    loadReviews();
  }, []);

  // Save to AsyncStorage whenever reviewItems change
  useEffect(() => {
    if (isLoaded) {
      AsyncStorage.setItem('copticlingo-reviews', JSON.stringify(reviewItems)).catch(error =>
        console.warn('Failed to save reviews:', error)
      );
    }
  }, [reviewItems, isLoaded]);

  const addReviewItem = (item: ReviewItem) => {
    setReviewItems(state => {
      const exists = state.find(r => r.exerciseId === item.exerciseId);
      if (exists) return state;
      return [...state, item];
    });
  };

  const updateReviewItem = (item: ReviewItem) => {
    setReviewItems(state =>
      state.map(r => (r.exerciseId === item.exerciseId ? item : r))
    );
  };

  const getDueReviews = () => {
    const today = new Date().toISOString().split('T')[0];
    return reviewItems.filter(item => item.nextReviewDate <= today);
  };

  if (!isLoaded) {
    return null;
  }

  return (
    <ReviewContext.Provider
      value={{
        reviewItems,
        addReviewItem,
        updateReviewItem,
        getDueReviews,
      }}
    >
      {children}
    </ReviewContext.Provider>
  );
};

export const useReviewStore = () => {
  const context = useContext(ReviewContext);
  if (!context) {
    throw new Error('useReviewStore must be used within ReviewProvider');
  }
  return context;
};
