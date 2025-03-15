import React from "react";
import Post from "./Post";
import kuehDadar from "../assets/images/Kueh_Dadar.jpg";
import kuehLapis from "../assets/images/Kueh_Lapis.jpg";
import kuehSalat from "../assets/images/Kueh_Salat.jpg";
import kuehUbi from "../assets/images/Kueh_Ubi.jpeg";
import ondehOndeh from "../assets/images/Ondeh_Ondeh.jpeg";
import angkukueh from "../assets/images/Angku_Kueh.jpg";
import liveEventSketch from "../assets/videos/Live_Event_Sketch.mp4";
import familyPortrait from "../assets/videos/Family_Portraits.mp4";
import weddingMemorySketches from "../assets/videos/Wedding_Memory_Sketches.mp4";
import customCommissionedArt from "../assets/videos/Custom_Commission_Art.mp4";
import edl1 from "../assets/images/EDL_1.jpg";
import edl2 from "../assets/images/EDL_2.jpg";
import com1 from "../assets/images/Com_1.jpg";
import com2 from "../assets/images/Com_2.jpg";
import com3 from "../assets/images/Com_3.jpg";
import com4 from "../assets/images/Com_4.jpg";
import com5 from "../assets/images/Com_5.jpg";
import com6 from "../assets/images/Com_6.jpg";
import com7 from "../assets/images/Com_7.jpg";
import com8 from "../assets/images/Com_8.jpg";
import com9 from "../assets/images/Com_9.jpg";
import YapKeeWanton from "../assets/images/YapKee_Wanton.JPG";

import HuiYangWeddingVideo from "../assets/videos/HuiYang_wedding.mp4";
import KuehDadarVideo from "../assets/videos/Kueh_Dadar.mp4";
import YapKeeWantonVideo from "../assets/videos/YapKee_Wanton.mp4";

function Feed() {
  // Dummy data for posts
  const posts = [
    {
      id: 1,
      username: "alice_K",
      media: [liveEventSketch, edl1, edl2, com1, com2, com3, com4, com5, com6, com7, com8, com9],
      caption: "Commissioned quick sketches for my colleague and their kids! 🎨👨‍👩‍👧‍👦✏️"
    },
    {
      id: 2,
      username: "HuiY_",
      media: [weddingMemorySketches, HuiYangWeddingVideo],
      caption: "Wedding highlight: Surprised guests with live portrait sketching at my special day! 🎨👰✨"
    },
    {
      id: 3,
      username: "KapYee_Wanton", 
      media: [familyPortrait, YapKeeWanton, YapKeeWantonVideo],
      caption: "Commissioned Jeff to do a sketch for my parents' wanton mee store! Thank you Jeff for promoting our family business. So happy to see their smiles upon receiving this artwork! 🎨🥟✨"
    },
    {
      id: 4,
      username: "Jas_",
      media: [customCommissionedArt, KuehDadarVideo, kuehDadar, angkukueh, ondehOndeh, kuehUbi, kuehSalat, kuehLapis],
      caption: "Check out these amazing desserts! Got a commission for my kueh illos! 🎨👩‍🍳✨"
    },
    // ... more dummy posts
  ];

  return (
    <div>
      {posts.map((post, index) => (
        <>
          <Post
            key={post.id}
            username={post.username}
            media={post.media}
            caption={post.caption}
          />
          {index !== posts.length - 1 && (
            <div style={{ borderBottom: "1px solid #dbdbdb", margin: "20px 0" }} />
          )}
        </>
      ))}
    </div>
  );
}

export default Feed;
