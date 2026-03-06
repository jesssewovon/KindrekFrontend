import { Link } from 'react-router';

import { useTheme } from "../ThemeContext";

import SwipeCard from "../components/SwipeCard";

import { useState, useRef } from "react";

import { useEffect } from "react";

import api from "../api";

import { useActivate, useUnactivate } from "react-activation";

import Header from '../components/Header';

interface ScrollPageProps{
    savedScroll: number;
    onSaveScroll: (scroll: number)=>void;
}

export default function ScrollPage({ savedScroll, onSaveScroll }: ScrollPageProps) {
  useActivate(() => {
    alert('activated')
    // restore scroll when component mounts
    //alert('savedScroll: '+savedScroll)
    window.scrollTo(0, savedScroll || 0);
    return () => {
      //console.log('onSaveScroll')
      // save scroll before unmount
      onSaveScroll(window.scrollY);
    };
    console.log("PageA re-activated");
  });

  useUnactivate(() => {
    console.log("PageA hidden");
  });
  
  const handleSwipe = (direction: string, tt: any) => {
    console.log("Swiped:", direction, tt);
  };

  const users = [
    { id: 1, name: "Alice", age: 24 },
    { id: 2, name: "Bob", age: 28 },
    { id: 3, name: "Charlie", age: 22 },
  ];

  const [items, setItems] = useState<any[]>([]);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const loaderRef = useRef<any>(null);

  // Fetch API data
  const fetchData = async () => {
    setLoading(true);
    const res = await api.get(`index-loading?page=${page}`)
      .then((res) => setItems((prev) => [...prev, ...res.data.products.data]))
      .catch((err) => console.error(err));
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [page]);

  // Intersection Observer to detect scroll end
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          setPage((prev) => prev + 1);
          //alert('page n° '+page+" window.scrollY: "+window.scrollY)
        }
      },
      { threshold: 1 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [loading]);

  useEffect(() => {
    const handleScroll = () => {
      //alert('here')
      onSaveScroll(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    // Cleanup listener on unmount
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
        <Header title={""} showBackButton={false} showWishList={true}/>
        <div className="page-content space-top p-b65">
    			<div className="container">
    					<p>ScrollPage</p>
              {loading?(<p>Intro loading</p>):(
                <>
                  {items.map((item) => (
                      <p>{item.id}</p>
                  ))}
                </>
              )}
              <div ref={loaderRef} className="p-4 m-2 text-center text-gray-500">
                Loading more...
              </div>
    			</div>
    		</div>
    </>
  );
}