import Layout from "@/components/Layout";
import {useSession} from "next-auth/react";
import styled from "styled-components";
import Link from "next/link";
import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";


import React from 'react';

const ProductCard = ({ product }) => (
    <div className="w-64 h-64 rounded overflow-hidden shadow-lg">
        <img className=" object-contain w-full h-2/5" src={product.images[0]} alt={product.title} />
        <div className="px-6 py-4">
            <div className="font-bold text-xl mb-2">{product.title}</div>
            <p className="text-gray-700 text-base">{product.description}</p>
            <p className="text-gray-900 text-xl mt-2">Rs.{product.price}</p>
        </div>
    </div>
);


export default function Home({featuredProduct,newProducts}) {
  
  const {data: session} = useSession();
  return <Layout>
    <div className="text-blue-900 flex justify-between">
      <h2>
        Hello, <b>{session?.user?.name}</b>
      </h2>
      <div className="flex bg-gray-300 gap-1 text-black rounded-lg overflow-hidden">
        <img src={session?.user?.image} alt="" className="w-6 h-6"/>
        <span className="px-2">
          {session?.user?.name}
        </span>
      </div>
    </div>
    <div className="mt-32 flex flex-wrap">
    {newProducts.map(product => (
            <ProductCard key={product._id} product={product} />
        ))}
    </div>
  </Layout>
}


export async function getServerSideProps() {
  const featuredProductId = '66379220b3cae0885563e91a';
  await mongooseConnect();
  const featuredProduct = await Product.findById(featuredProductId);
  const newProducts = await Product.find({}, null, {sort: {'_id':-1}, limit:10});
  return {
    props: {
      featuredProduct: JSON.parse(JSON.stringify(featuredProduct)),
      newProducts: JSON.parse(JSON.stringify(newProducts)),
    },
  };
}
