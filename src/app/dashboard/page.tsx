// app/dashboard/page.tsx
"use client";
import React from "react";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  Share2,
  ThumbsUp,
  ThumbsDown,
  Music,
  Copy,
  Check,
  PlayCircle,
} from "lucide-react";
import Appbar from "../components/Appbar";
import axios from "axios";

// Type for video items in queue
interface VideoItem {
  id: string;
  title: string;
  thumbnail: string;
  upvotes: number;
  downvotes: number;
  userVote: "up" | "down" | null;
  addedBy: string;
}

export default function Dashboard() {
  const { data: session } = useSession();
  const [userRole, setUserRole] = useState<string>("creator");
  const [currentVideo, setCurrentVideo] = useState<VideoItem | null>(null);
  const [videoQueue, setVideoQueue] = useState<VideoItem[]>([]);
  const [newVideoUrl, setNewVideoUrl] = useState<string>("");
  const [previewVideo, setPreviewVideo] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const REFRESH_INTERVAL_MS = 10 * 1000;

  useEffect(() => {
    setTimeout(() => {
      const mockCurrentVideo = {
        id: "dQw4w9WgXcQ",
        title: "Rick Astley - Never Gonna Give You Up",
        thumbnail: "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
        upvotes: 24,
        downvotes: 3,
        userVote: null,
        addedBy: "DJ_Creator",
      };

      const mockQueue = [
        {
          id: "9bZkp7q19f0",
          title: "PSY - GANGNAM STYLE(강남스타일)",
          thumbnail: "https://i.ytimg.com/vi/9bZkp7q19f0/hqdefault.jpg",
          upvotes: 18,
          downvotes: 2,
          userVote: "up" as "up",
          addedBy: "Fan123",
        },
        {
          id: "J2X5mJ3HDYE",
          title: "Coldplay - Paradise (Official Video)",
          thumbnail: "https://i.ytimg.com/vi/J2X5mJ3HDYE/hqdefault.jpg",
          upvotes: 12,
          downvotes: 1,
          userVote: null,
          addedBy: "MusicLover42",
        },
        {
          id: "1G4isv_Fylg",
          title: "Coldplay - Clocks (Official Video)",
          thumbnail: "https://i.ytimg.com/vi/1G4isv_Fylg/hqdefault.jpg",
          upvotes: 8,
          downvotes: 0,
          userVote: null,
          addedBy: "StreamFan99",
        },
      ];

      setCurrentVideo(mockCurrentVideo);
      setVideoQueue(mockQueue);
      setLoading(false);
    }, 1000);
  }, []);

  const handleVideoUrlChange = (url: string) => {
    setNewVideoUrl(url);
    const regex =
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    setPreviewVideo(match?.[1] || null);
  };

  const handleAddVideo = () => {
    if (previewVideo) {
      const newVideo: VideoItem = {
        id: previewVideo,
        title: "New Video Title",
        thumbnail: `https://i.ytimg.com/vi/${previewVideo}/hqdefault.jpg`,
        upvotes: 1,
        downvotes: 0,
        userVote: "up",
        addedBy: session?.user?.name || "Anonymous",
      };
      setVideoQueue([...videoQueue, newVideo]);
      setNewVideoUrl("");
      setPreviewVideo(null);
    }
  };

  const handleVote = async (id: string, isUpvote: boolean) => {
    // Update local state for immediate feedback
    const updatedQueue = videoQueue.map((video) => {
      if (video.id === id) {
        return {
          ...video,
          upvotes: isUpvote ? video.upvotes + 1 : video.upvotes,
          downvotes: !isUpvote ? video.downvotes + 1 : video.downvotes,
          userVote: isUpvote ? "up" as "up" : "down" as "down"
        };
      }
      return video;
    });
    
    // Sort by upvotes
    const sortedQueue = [...updatedQueue].sort((a, b) => b.upvotes - a.upvotes);
    setVideoQueue(sortedQueue as VideoItem[]);
    
    // Also update current video if it matches the voted ID
    if (currentVideo && currentVideo.id === id) {
      setCurrentVideo({
        ...currentVideo,
        upvotes: isUpvote ? currentVideo.upvotes + 1 : currentVideo.upvotes,
        downvotes: !isUpvote ? currentVideo.downvotes + 1 : currentVideo.downvotes,
        userVote: isUpvote ? "up" : "down"
      });
    }
  
    try {
      // Send the vote to the API
      const response = await fetch("/api/streams/upvote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          streamId: id, // Match the case with what your API expects
          isUpvote: isUpvote
        }),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Failed to register vote: ${response.status} ${errorText}`);
        // You might want to revert the local change if the API call fails
      }
    } catch (error) {
      console.error("Error voting for video:", error);
    }
  };

  async function refreshStreams() {
    try {
      const res = await fetch("/api/streams/my", {
        credentials: "include",
      });
      
      if (res.ok) {
        const data = await res.json();
        // Update state with data from API
        if (data.currentVideo) {
          setCurrentVideo(data.currentVideo);
        }
        if (data.queue) {
          setVideoQueue(data.queue);
        }
      } else {
        console.error("Failed to refresh streams", await res.text());
      }
    } catch (error) {
      console.error("Error refreshing streams:", error);
    }
  }

  useEffect(() => {
    refreshStreams();
    const interval = setInterval(() => {
      refreshStreams();
    }, REFRESH_INTERVAL_MS);
    
    return () => clearInterval(interval); // Clean up interval on component unmount
  }, []);

  const shareUrl =
    typeof window !== "undefined" ? window.location.href : "";

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex justify-center items-center">
        <div className="animate-pulse flex flex-col items-center">
          <Music size={48} className="text-purple-400 animate-bounce" />
          <p className="mt-4 text-purple-300">Loading your music dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <div className="fixed inset-0 z-0">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-purple-900 opacity-20 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-indigo-800 opacity-20 blur-3xl"></div>
      </div>

      <nav className="py-6 px-8 flex items-center justify-between z-10 sticky top-0 backdrop-blur-md bg-black bg-opacity-30">
        <div className="flex items-center space-x-2">
          <Music size={32} className="text-purple-400" />
          <Link href="/" className="text-2xl font-bold">
            Muzu
          </Link>
        </div>
        <Appbar />
      </nav>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold">Your Music Dashboard</h1>
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-2 px-4 py-2 bg-purple-700 hover:bg-purple-600 rounded-full transition-all"
              >
                {copied ? <Check size={18} /> : <Share2 size={18} />}
                <span>{copied ? "Copied!" : "Share"}</span>
              </button>
            </div>

            {userRole === "creator" && (
              <div className="mb-8 p-4 bg-purple-900/20 border border-purple-800/50 rounded-lg">
                <h2 className="text-xl font-bold mb-2">Creator Controls</h2>
                <p className="text-gray-300 mb-4">
                  Share this page with your fans to let them pick your music!
                </p>
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={shareUrl}
                    readOnly
                    className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500"
                  />
                  <button
                    onClick={copyToClipboard}
                    className="px-4 py-2 bg-purple-700 hover:bg-purple-600 rounded-lg transition-all flex items-center gap-2"
                  >
                    {copied ? <Check size={18} /> : <Copy size={18} />}
                    <span className="hidden md:inline">
                      {copied ? "Copied!" : "Copy"}
                    </span>
                  </button>
                </div>
              </div>
            )}

            {/* Now Playing */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <PlayCircle size={24} className="mr-2 text-purple-400" />
                Now Playing
              </h2>
              <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800">
                <div className="aspect-video w-full">
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${currentVideo?.id}?autoplay=1`}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full aspect-video"
                  ></iframe>
                </div>
                <div className="p-4 flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold">{currentVideo?.title}</h3>
                    <p className="text-gray-400 text-sm">
                      Added by {currentVideo?.addedBy}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center">
                      <button
                        onClick={() => currentVideo && handleVote(currentVideo.id, true)}
                        className={`p-1 ${
                          currentVideo?.userVote === "up"
                            ? "text-green-500"
                            : "text-gray-400 hover:text-green-400"
                        }`}
                      >
                        <ThumbsUp size={18} />
                      </button>
                      <span className="ml-1">{currentVideo?.upvotes}</span>
                    </div>
                    <div className="flex items-center">
                      <button
                        onClick={() => currentVideo && handleVote(currentVideo.id, false)}
                        className={`p-1 ${
                          currentVideo?.userVote === "down"
                            ? "text-red-500"
                            : "text-gray-400 hover:text-red-400"
                        }`}
                      >
                        <ThumbsDown size={18} />
                      </button>
                      <span className="ml-1">{currentVideo?.downvotes}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Add song input */}
            <div className="mb-8 flex gap-2">
              <input
                type="text"
                value={newVideoUrl}
                onChange={(e) => handleVideoUrlChange(e.target.value)}
                placeholder="Paste YouTube video link"
                className="flex-1 px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none"
              />
              <button
                onClick={handleAddVideo}
                disabled={!previewVideo}
                className="bg-purple-700 px-4 py-2 rounded-lg disabled:opacity-40"
              >
                Add
              </button>
            </div>

            {/* Video Queue */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Upcoming Songs</h2>
              <div className="space-y-4">
                {videoQueue.map((video) => (
                  <div
                    key={video.id}
                    className="bg-gray-900/60 rounded-lg border border-gray-800 hover:border-purple-800/50 transition-all flex flex-col sm:flex-row"
                  >
                    <div className="sm:w-48 h-24 relative">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <PlayCircle size={36} className="text-white" />
                      </div>
                    </div>
                    <div className="p-4 flex-1 flex flex-col sm:flex-row items-start sm:items-center justify-between">
                      <div>
                        <h3 className="font-semibold line-clamp-1">
                          {video.title}
                        </h3>
                        <p className="text-gray-400 text-sm">
                          Added by {video.addedBy}
                        </p>
                      </div>
                      <div className="flex items-center gap-4 mt-2 sm:mt-0">
                        <div className="flex items-center">
                          <button
                            onClick={() => handleVote(video.id, true)}
                            className={`p-1 ${
                              video.userVote === "up"
                                ? "text-green-500"
                                : "text-gray-400 hover:text-green-400"
                            }`}
                          >
                            <ThumbsUp size={18} />
                          </button>
                          <span className="ml-1">{video.upvotes}</span>
                        </div>
                        <div className="flex items-center">
                          <button
                            onClick={() => handleVote(video.id, false)}
                            className={`p-1 ${
                              video.userVote === "down"
                                ? "text-red-500"
                                : "text-gray-400 hover:text-red-400"
                            }`}
                          >
                            <ThumbsDown size={18} />
                          </button>
                          <span className="ml-1">{video.downvotes}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}