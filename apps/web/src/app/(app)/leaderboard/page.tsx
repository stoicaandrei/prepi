"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function LeaderboardStacked() {
  const leaderboardData = [
    { name: "Christina", score: 0, rank: 1 },
    { name: "RebecaPop", score: 0, rank: 2 },
    { name: "Adrian98", score: 0, rank: 3 },
    { name: "Andreea ioana", score: 0, rank: 4 },
    { name: "cris", score: 0, rank: 5 },
    { name: "Daniel67", score: 0, rank: 6 },
    { name: "Cristina Văduva", score: 0, rank: 7 },
    { name: "darius", score: 0, rank: 8 },
    { name: "Gelu", score: 0, rank: 9 },
    { name: "Volosciucedmond", score: 0, rank: 10 },
    { name: "Catalin2000", score: 0, rank: 11 },
    { name: "Basarab", score: 0, rank: 12 },
  ];

  return (
    <div className="container mx-auto space-y-4">
      <Card className="bg-gradient-to-r from-blue-400 to-indigo-500">
        <CardContent className="flex items-center justify-between p-6">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage
                src="/placeholder.svg?height=64&width=64"
                alt="Andreieil"
              />
              <AvatarFallback>AE</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold text-white">Andreieil</h2>
              <p className="text-blue-100">învățăcel</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="bg-yellow-400 text-yellow-900 font-bold rounded-full p-1 text-xs">
              0
            </div>
            <div className="bg-white text-blue-500 font-bold rounded-full py-1 px-3 text-lg">
              2204
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6 text-blue-500"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            <span className="text-blue-500 text-2xl">Clasament</span>
          </CardTitle>
          <Tabs defaultValue="today" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="today">Azi</TabsTrigger>
              <TabsTrigger value="week">Săpt. asta</TabsTrigger>
              <TabsTrigger value="month">Luna asta</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {leaderboardData.map((user) => (
              <div
                key={user.name}
                className="flex items-center justify-between"
              >
                <div className="flex items-center space-x-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src="/placeholder.svg?height=40&width=40"
                      alt={user.name}
                    />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-sm text-gray-500">învățăcel</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="bg-yellow-100 text-yellow-800 font-bold rounded-full p-1 text-xs">
                    {user.score}
                  </div>
                  <div className="bg-blue-100 text-blue-800 font-bold rounded-full h-8 w-8 flex items-center justify-center">
                    {user.rank}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
