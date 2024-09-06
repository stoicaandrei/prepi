"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function ShopPage() {
  const [activeTab, setActiveTab] = useState("avatars");

  const avatars = [
    {
      id: 1,
      name: "Blue Dragon",
      price: 500,
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 2,
      name: "Orange Griffin",
      price: 750,
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 3,
      name: "Blue Dragon Sitting",
      price: 2500,
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 4,
      name: "Orange Griffin Flying",
      price: 3750,
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 5,
      name: "Fox",
      price: 1000,
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 6,
      name: "Fox Running",
      price: 1500,
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 7,
      name: "Green Dinosaur",
      price: 1250,
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 8,
      name: "Baby Dinosaur",
      price: 2500,
      image: "/placeholder.svg?height=100&width=100",
    },
  ];

  const titles = [
    { id: 1, name: "Steluță", price: 50 },
    { id: 2, name: "Profi", price: 100 },
    { id: 3, name: "Lider", price: 250 },
    { id: 4, name: "Stea", price: 400 },
    { id: 5, name: "Stea căzătoare", price: 500 },
    { id: 6, name: "Boss", price: 500 },
    { id: 7, name: "Mare boss", price: 600 },
    { id: 8, name: "Boss la mate", price: 650 },
    { id: 9, name: "Expert", price: 750 },
    { id: 10, name: "Superom", price: 750 },
    { id: 11, name: "Bestie", price: 750 },
    { id: 12, name: "Guru", price: 1250 },
    { id: 13, name: "Rege", price: 1250 },
  ];

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center mb-6">
        <div className="text-3xl font-bold text-blue-500">
          <span className="bg-blue-500 text-white p-1 rounded mr-2">🛍️</span>
          Magazin
        </div>
      </div>

      <Tabs defaultValue="avatars" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="avatars" onClick={() => setActiveTab("avatars")}>
            Avatare
          </TabsTrigger>
          <TabsTrigger value="titles" onClick={() => setActiveTab("titles")}>
            Titluri
          </TabsTrigger>
        </TabsList>
        <TabsContent value="avatars">
          <h2 className="text-2xl font-bold mb-4">Avatare cumpărate</h2>
          <div className="mb-6">
            <Image
              src="/placeholder.svg?height=100&width=100"
              alt="Purchased Avatar"
              width={100}
              height={100}
              className="rounded-lg"
            />
            <Button className="mt-2">Aplică</Button>
          </div>
          <h2 className="text-2xl font-bold mb-4">Avatare disponibile</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {avatars.map((avatar) => (
              <div key={avatar.id} className="flex flex-col items-center">
                <Image
                  src={avatar.image}
                  alt={avatar.name}
                  width={100}
                  height={100}
                  className="rounded-lg"
                />
                <span className="mt-2 flex items-center">
                  <span className="bg-blue-500 text-white rounded-full p-1 text-xs mr-1">
                    💎
                  </span>
                  {avatar.price}
                </span>
              </div>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="titles">
          <h2 className="text-2xl font-bold mb-4">Titluri cumpărate</h2>
          <div className="mb-6">
            <span className="text-lg font-semibold">Învățăcel</span>
            <Button className="ml-2">Aplică</Button>
          </div>
          <h2 className="text-2xl font-bold mb-4">Titluri disponibile</h2>
          <div className="grid gap-2">
            {titles.map((title) => (
              <div
                key={title.id}
                className="flex justify-between items-center border-b py-2"
              >
                <span className="text-lg">{title.name}</span>
                <span className="flex items-center">
                  <span className="bg-blue-500 text-white rounded-full p-1 text-xs mr-1">
                    💎
                  </span>
                  {title.price}
                </span>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
