import { useState, useEffect } from "react";
import SwipeCard from "./SwipeCard";
import type { ProfileState } from "../types";

interface SwipeDeckProps{
  profiles: ProfileState[];
  onSwipe: (dir: string,
    user: ProfileState,
    nb?: number)=>void;
  remainingFreeSwiping: number;
  isSwipingUnlimited: boolean;
  subscriptionData: any;
}
export default function SwipeDeck({ profiles = [], onSwipe, remainingFreeSwiping, isSwipingUnlimited, subscriptionData }: SwipeDeckProps) {
  const [cards, setCards] = useState(profiles);

  // 🔄 Sync local cards whenever parent `profiles` changes
  useEffect(() => {
    setCards(profiles);
  }, [profiles]);

  const handleCardSwipe = (direction: string, profile: ProfileState) => {
    onSwipe(direction, profile, cards.length);
    // remove swiped card from local stack
    setCards((prev) => prev.filter((c: any) => c.id !== profile.id));
  };
  return (
    <div className="" style={{position: "relative", width: "100%", height: 'calc(100vh - 150px)', overflow: "hidden", borderRadius: "20px"}}>
      {cards
        .map((profile: ProfileState) => (
          <SwipeCard
            key={profile.id}
            profile={profile}
            onSwipe={handleCardSwipe}
            remainingFreeSwiping={remainingFreeSwiping}
            isSwipingUnlimited={isSwipingUnlimited}
            subscriptionData={subscriptionData}
            disabled={false}
            /* style={{ zIndex: cards.length - index }} */
          />
        ))
        //.reverse()
      }
    </div>
  );
}
