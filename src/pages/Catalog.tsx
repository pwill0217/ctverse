import React, { useState } from 'react';
import { Star, StarHalf, Search, Filter, ShoppingCart, Plus, Check } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useCollection } from '../hooks/useCollection';
import { doc, setDoc, deleteDoc,  } from "firebase/firestore";
import { db } from "../firebase";

interface Product {
  id: string;
  name: string;
  image: string;
  releaseYear: number;
  rating: number;
  price: number;
  aliExpressUrl: string;
}

const comingSoonProducts: Product[] = [
  {
    id: '101',
    name: 'CT Toys Batman Mafex 126 ',
    image: 'https://i.ebayimg.com/images/g/uRIAAOSw~QVoUoTo/s-l960.webp',
    releaseYear: 2025,
    rating: 0, // No rating yet
    price: 28.37, // Price not available
    aliExpressUrl: 'https://www.aliexpress.us/item/3256809120640751.html?pdp_npi=4%40dis%21USD%21US%20%2477.48%21US%20%2421.87%21%21%21552.26%21155.86%21%402101ef7017518212177115700ebd38%2112000048688659224%21sh%21US%210%21X&spm=a2g0o.store_pc_allItems_or_groupList.new_all_items_2007567562990.1005009306955503&gatewayAdapt=glo2usa',
  },
  {
    id: '102',
    name: 'Mess Toys (CT Toys) Amazing Yamaguchi style Symbiote Spider-man',
    image: 'https://ae-pic-a1.aliexpress-media.com/kf/S7cff800437cb4f29b7ad831dfdc84aacx.jpg_220x220q75.jpg_.avif',
    releaseYear: 2025,
    rating: 0, // No rating yet
    price: 57.27, // Price not available
    aliExpressUrl: 'https://www.aliexpress.us/item/3256808962646083.html?pdp_npi=4%40dis%21USD%21US%20%2481.76%21US%20%2423.79%21%21%21582.78%21169.59%21%402101c80217518214176695212ee5b3%2112000048421611601%21sh%21US%210%21X&spm=a2g0o.store_pc_allItems_or_groupList.new_all_items_2007567562990.1005009148960835&gatewayAdapt=glo2usa',
  },
  
  {
    id: '103',
    name: 'Mess Toys (CT Toys) Amazing Yamaguchi style Scarlet Spider (Kaine Parker)',
    image: 'https://i.ebayimg.com/images/g/mKcAAOSwUqdoWM2H/s-l1200.jpg',
    releaseYear: 2025,
    rating: 0, // No rating yet
    price: 57.27, 
    aliExpressUrl: 'https://www.aliexpress.us/item/3256808880852310.html?pdp_npi=4%40dis%21USD%21US%20%2481.76%21US%20%2425.79%21%21%21582.78%21183.85%21%402101c80217518214176695212ee5b3%2112000048421841569%21sh%21US%210%21X&spm=a2g0o.store_pc_allItems_or_groupList.new_all_items_2007567562990.1005009067167062&gatewayAdapt=glo2usa',
  },

  
];


const mockProducts: Product[] = [
  {
    id: '1',
    name: 'CT Toys Hellverine',
    image: 'https://imgs.search.brave.com/8iu8dZDjx31LqcSpny0pZ4H6S9tVgjYLtTBvET0UXX0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9wcmV2/aWV3LnJlZGQuaXQv/Y3QtdG95cy1oZWxs/dmVyaW5lLXYwLWtm/a3dieDJ3YzFuZTEu/anBnP3dpZHRoPTY0/MCZjcm9wPXNtYXJ0/JmF1dG89d2VicCZz/PTY5ZDM1NmRmMTI3/M2ZmMWRhOGMxMTI5/ZWUxN2Y4MzBjMzlj/OTRjZTQ',
    releaseYear: 2025,
    rating: 4.8,
    price: 27.33,
    aliExpressUrl: 'https://www.aliexpress.us/item/3256808420222161.html?pdp_npi=4%40dis%21USD%21US%20%2460.76%21US%20%2416.34%21%21%21433.10%21116.49%21%402101e07217518221549123517eb249%2112000048372277122%21sh%21US%210%21X&spm=a2g0o.store_pc_allItems_or_groupList.new_all_items_2007567562990.1005008606536913&gatewayAdapt=glo2usa'
  },
  {
    id: '2',
    name: 'CT Toys The Amazing Spider-Man',
    image: 'https://imgs.search.brave.com/9mSYW0JF0hBcqEG-l_6NP6OzStIC_-dLmRl8yBPjZsc/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/aW5hYm94c3RvcmUu/Y29tL2Nkbi9zaG9w/L2ZpbGVzL2N0LXRv/eXMtdGhlLWFtYXpp/bmctc3BpZGVyLW1h/bi1hY3Rpb24tZmln/dXJlLW1hZmV4LTAw/MS1hbmRyZXctZ2Fy/ZmllbGQtdmVyc2lv/bi0zODkzMDIuanBn/P3Y9MTc0MzQxNTQz/NyZ3aWR0aD0xNDQ1',
    releaseYear: 2025,
    rating: 4.6,
    price: 20.08,
    aliExpressUrl: 'https://www.aliexpress.us/item/3256808021472813.html?pdp_npi=4%40dis%21USD%21US%20%2450.13%21US%20%2416.06%21%21%21361.93%21115.94%21%402101c71a17439783646912876ecfa7%2112000046609828247%21sh%21US%210%21X&spm=a2g0o.store_pc_allItems_or_groupList.new_all_items_2007567562990.1005008207787565&gatewayAdapt=glo2usa'
  },
  {
    id: '3',
    name: 'CT Toys Spiderman (Ben Reilly)',
    image: 'https://imgs.search.brave.com/mPHTj-_MP9a0w4ReC38eUxdfjpAp91FIooTP92Kpy24/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLnJl/ZGQuaXQvcTI2Y2xt/cHJpOTVlMS5qcGVn',
    releaseYear: 2025,
    rating: 4.7,
    price: 15.60,
    aliExpressUrl: 'https://www.aliexpress.us/item/3256808014773986.html?pdp_npi=4%40dis%21USD%21US%20%2451.60%21US%20%2416.72%21%21%21372.59%21120.74%21%402101c71a17439783646912876ecfa7%2112000046412799421%21sh%21US%210%21X&spm=a2g0o.store_pc_allItems_or_groupList.new_all_items_2007567562990.1005008201088738&gatewayAdapt=glo2usa'
  },
  {
    id: '4',
    name: 'CT Toys Amazing Yamaguchi Spider-Man 2.0 ',
    image: 'https://imgs.search.brave.com/pQie4T6bNNwdkoWX5sipMSqzuKmmtkggJhggJBlEB_I/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/NjFRRkZxdWp0T0wu/anBn',
    releaseYear: 2025,
    rating: 4.9,
    price: 21.06,
    aliExpressUrl: 'https://www.aliexpress.us/item/3256808040974481.html?gps-id=pcStoreJustForYou&scm=1007.23125.137358.0&scm_id=1007.23125.137358.0&scm-url=1007.23125.137358.0&pvid=a2262d12-b744-4728-bc90-52961cef1dd9&_t=gps-id%3ApcStoreJustForYou%2Cscm-url%3A1007.23125.137358.0%2Cpvid%3Aa2262d12-b744-4728-bc90-52961cef1dd9%2Ctpp_buckets%3A668%232846%238111%231996&pdp_ext_f=%7B%22order%22%3A%221003%22%2C%22eval%22%3A%221%22%2C%22sceneId%22%3A%2213125%22%7D&pdp_npi=4%40dis%21USD%2151.56%2116.70%21%21%21377.75%21122.37%21%402101c80017443213727355204e8414%2112000045949435800%21rec%21US%21%21ABX&spm=a2g0o.store_pc_home.smartJustForYou_2005299976221.1005008227289233&gatewayAdapt=glo2usa'
  },
  {
    id: '5',
    name: 'CT Toys Wolverine (Tiger Stripe)',
    image: 'https://imgs.search.brave.com/OtEa6-TI9586RG-4zHwGGNbz8eFNgXQKCiFn6bUKMYQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9odHRw/Mi5tbHN0YXRpYy5j/b20vRF9RX05QXzJY/Xzk5NjgyNi1NTE04/MTczOTc2MjU0N18w/MTIwMjUtRS53ZWJw',
    releaseYear: 2025,
    rating: 4.8,
    price: 13.84,
    aliExpressUrl: 'https://www.aliexpress.us/item/3256807907572652.html?gps-id=pcStoreJustForYou&scm=1007.23125.137358.0&scm_id=1007.23125.137358.0&scm-url=1007.23125.137358.0&pvid=a2262d12-b744-4728-bc90-52961cef1dd9&_t=gps-id%3ApcStoreJustForYou%2Cscm-url%3A1007.23125.137358.0%2Cpvid%3Aa2262d12-b744-4728-bc90-52961cef1dd9%2Ctpp_buckets%3A668%232846%238111%231996&pdp_ext_f=%7B%22order%22%3A%221871%22%2C%22eval%22%3A%221%22%2C%22sceneId%22%3A%2213125%22%7D&pdp_npi=4%40dis%21USD%2148.75%2115.44%21%21%21357.15%21113.10%21%402101c80017443213727355204e8414%2112000046412771995%21rec%21US%21%21ABX&spm=a2g0o.store_pc_home.smartJustForYou_2005299976221.1005008093887404&gatewayAdapt=glo2usa'
  },
  {
    id: '6',
    name: 'CT Toys Wolverine (Brown Suit)',
    image: 'https://imgs.search.brave.com/oG2qJEEo43sM7rOYhfNCKLAAxUhA7qEt27HmHErLS58/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLmVi/YXlpbWcuY29tL2lt/YWdlcy9nL1N-c0FB/T1N3a345bX5oMEkv/cy1sNTAwLmpwZw',
    releaseYear: 2025,
    rating: 4.8,
    price: 13.84,
    aliExpressUrl: 'https://www.aliexpress.us/item/3256807907572652.html?gps-id=pcStoreJustForYou&scm=1007.23125.137358.0&scm_id=1007.23125.137358.0&scm-url=1007.23125.137358.0&pvid=a2262d12-b744-4728-bc90-52961cef1dd9&_t=gps-id%3ApcStoreJustForYou%2Cscm-url%3A1007.23125.137358.0%2Cpvid%3Aa2262d12-b744-4728-bc90-52961cef1dd9%2Ctpp_buckets%3A668%232846%238111%231996&pdp_ext_f=%7B%22order%22%3A%221871%22%2C%22eval%22%3A%221%22%2C%22sceneId%22%3A%2213125%22%7D&pdp_npi=4%40dis%21USD%2148.75%2115.44%21%21%21357.15%21113.10%21%402101c80017443213727355204e8414%2112000046412771995%21rec%21US%21%21ABX&spm=a2g0o.store_pc_home.smartJustForYou_2005299976221.1005008093887404&gatewayAdapt=glo2usa'
  },
  {
    id: '7',
    name: 'CT Toys Agent Venom Amazing Yamaguchi',
    image: 'https://imgs.search.brave.com/HShTDi8ZXZrh5JIM1n-7otKYKhP-0S_DuaK-RfL_qSk/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pNS53/YWxtYXJ0aW1hZ2Vz/LmNvbS9zZW8vQ1Qt/VG95cy1LYWl5YW5n/ZG8tUmV2b2x0ZWNo/LUFtYXppbmctWWFt/YWd1Y2hpLUFnZW50/LVZlbm9tLUFjdGlv/bi1GaWd1cmUtNmlu/LU5FV18zYzFhMGQx/OS03OTU1LTQxMTct/OGNkZi1kNDBiZTFm/MmNiOGUuN2M5Mzk4/ZWU1MDA4M2Q0YjVi/MjRiMTgxMzYxMTBl/MzEucG5nP29kbkhl/aWdodD02NDAmb2Ru/V2lkdGg9NjQwJm9k/bkJnPUZGRkZGRg',
    releaseYear: 2024,
    rating: 4.8,
    price: 26.87,
    aliExpressUrl: 'https://www.aliexpress.us/item/3256808413422006.html?pdp_npi=4%40dis%21USD%21US%20%2474.16%21US%20%2420.37%21%21%21528.55%21145.19%21%402101e07217518221549123517eb249%2112000048375276919%21sh%21US%210%21X&spm=a2g0o.store_pc_allItems_or_groupList.new_all_items_2007567562990.1005008599736758&gatewayAdapt=glo2usa'
  },
  {
    id: '8',
    name: 'CT Toys Web Man',
    image: 'https://i.ebayimg.com/images/g/qRoAAOSw-ItnJJE0/s-l1200.jpg',
    releaseYear: 2024,
    rating: 4.6,
    price: 27.91,
    aliExpressUrl: 'https://www.aliexpress.us/item/3256807927773881.html?spm=a2g0o.productlist.main.5.24ae3709clUgd8&algo_pvid=e00e8a64-f836-488c-8e5d-42a3a4a456f4&algo_exp_id=e00e8a64-f836-488c-8e5d-42a3a4a456f4-4&pdp_ext_f=%7B%22order%22%3A%22333%22%2C%22eval%22%3A%221%22%7D&pdp_npi=4%40dis%21USD%2159.39%2126.73%21%21%21431.93%21194.37%21%402103205117453578840371394e06cc%2112000045917576622%21sea%21US%211793174653%21X&curPageLogUid=jfMBwsnNGt2I&utparam-url=scene%3Asearch%7Cquery_from%3A'
  },
  {
    id: '9',
    name: 'CT Symbiote Spider-man',
    image: 'https://imgs.search.brave.com/ax6u24FWpAeehVhZvmsFZGR0bEXD7R9NFz6YHIrMRsU/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4x/MS5iaWdjb21tZXJj/ZS5jb20vcy04OWZm/ZC9pbWFnZXMvc3Rl/bmNpbC83Mjh4NzI4/L3Byb2R1Y3RzLzk5/ODY4LzQxODU3NS80/NTMwOTU2NDcxNjg2/X2VjNTBmODhmZTE0/YWE4ZTdkNWQ4OTJk/YzZlMzA0MDU4X18z/MDIzNi4xNjY1OTgy/NDQ2LmpwZz9jPTI',
    releaseYear: 2024,
    rating: 4.8,
    price: 27.03,
    aliExpressUrl: 'https://www.aliexpress.us/item/3256807927773881.html?spm=a2g0o.productlist.main.5.24ae3709clUgd8&algo_pvid=e00e8a64-f836-488c-8e5d-42a3a4a456f4&algo_exp_id=e00e8a64-f836-488c-8e5d-42a3a4a456f4-4&pdp_ext_f=%7B%22order%22%3A%22333%22%2C%22eval%22%3A%221%22%7D&pdp_npi=4%40dis%21USD%2159.39%2126.73%21%21%21431.93%21194.37%21%402103205117453578840371394e06cc%2112000045917576622%21sea%21US%211793174653%21X&curPageLogUid=jfMBwsnNGt2I&utparam-url=scene%3Asearch%7Cquery_from%3A'
  },
  {
    id: '10',
    name: 'CT  Spider-man 185',
    image: 'https://m.media-amazon.com/images/I/619g5sAXjuL.__AC_SX300_SY300_QL70_FMwebp_.jpg',
    releaseYear: 2024,
    rating: 4.6,
    price: 27.91,
    aliExpressUrl: 'https://www.aliexpress.us/item/3256807927773881.html?spm=a2g0o.productlist.main.5.24ae3709clUgd8&algo_pvid=e00e8a64-f836-488c-8e5d-42a3a4a456f4&algo_exp_id=e00e8a64-f836-488c-8e5d-42a3a4a456f4-4&pdp_ext_f=%7B%22order%22%3A%22333%22%2C%22eval%22%3A%221%22%7D&pdp_npi=4%40dis%21USD%2159.39%2126.73%21%21%21431.93%21194.37%21%402103205117453578840371394e06cc%2112000045917576622%21sea%21US%211793174653%21X&curPageLogUid=jfMBwsnNGt2I&utparam-url=scene%3Asearch%7Cquery_from%3A'
  },
  {
    id: '11',
    name: 'CT Spider-man(Miles Morales)',
    image: 'https://imgs.search.brave.com/_bL6gQpIEUOtY9ozSB8SoZbaJkzmiR04zeJLQyl7ANo/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLmVi/YXlpbWcuY29tL2lt/YWdlcy9nL3M5d0FB/T1N3dWM5bXNIU0wv/cy1sNTAwLmpwZw',
    releaseYear: 2024,
    rating: 4.7,
    price: 27.03,
    aliExpressUrl: 'https://www.aliexpress.us/item/3256807927773881.html?pdp_npi=4%40dis%21USD%21US%20%2432.83%21US%20%248.28%21%21%21240.48%2160.60%21%402101ef5e17443265196664022e491e%2112000045917576622%21sh%21US%210%21X&spm=a2g0o.store_pc_allItems_or_groupList.new_all_items_2007567562990.1005008114088633https://www.aliexpress.us/item/3256808297690410.html?pdp_npi=4%40dis%21USD%21US%20%2432.60%21US%20%248.17%21%21%21238.84%2159.86%21%4021030ea417443248211983035ea22a%2112000046413984419%21sh%21US%210%21X&spm=a2g0o.store_pc_allItems_or_groupList.new_all_items_2007567562990.1005008484005162&gatewayAdapt=glo2usagatewayAdapt=glo2usa'
  },
  {
    id: '12',
    name: 'CT Spider-man 2099(Across The Spiderverse)',
    image: 'https://imgs.search.brave.com/yz7Kux_eQmdltzhKzcZkqMI-NY8q6b3pyuzE50npu5o/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/c3VwZXJoZXJvdG95/c3RvcmUuY29tL2Nk/bi9zaG9wL2ZpbGVz/L0FBRE0zNjVBQUVB/NDktMS5qcGc_dj0x/Njg3ODYwNTA5Jndp/ZHRoPTEyMDA',
    releaseYear: 2024,
    rating: 4.7,
    price: 28.06,
    aliExpressUrl: 'https://www.aliexpress.us/item/3256806542426743.html?spm=a2g0o.detail.pcDetailBottomMoreOtherSeller.5.1d60QqC6QqC6H5&gps-id=pcDetailBottomMoreOtherSeller&scm=1007.40050.354490.0&scm_id=1007.40050.354490.0&scm-url=1007.40050.354490.0&pvid=8765d648-647c-477f-84c2-b5b91663ccb5&_t=gps-id:pcDetailBottomMoreOtherSeller,scm-url:1007.40050.354490.0,pvid:8765d648-647c-477f-84c2-b5b91663ccb5,tpp_buckets:668%232846%238116%232002&pdp_ext_f=%7B%22order%22%3A%22904%22%2C%22eval%22%3A%221%22%2C%22sceneId%22%3A%2230050%22%7D&pdp_npi=4%40dis%21USD%2162.36%2120.38%21%21%21452.53%21147.88%21%40210312d517452679756656417ee47f%2112000038199107343%21rec%21US%21%21ABXZ&utparam-url=scene%3ApcDetailBottomMoreOtherSeller%7Cquery_from%3A'
  },
  {
    id: '13',
    name: 'CT Spider-man Miles Morales (Across The Spiderverse)',
    image: 'https://imgs.search.brave.com/AtUjlE-6kRWEfR7qv22p-DI-uuSENApQ0BD80hWOX0E/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9kM250/OWVtOWwxdXJ6OC5j/bG91ZGZyb250Lm5l/dC9tZWRpYS9jYXRh/bG9nL3Byb2R1Y3Qv/Y2FjaGUvMy9pbWFn/ZS8xMTAweC8wNDBl/YzA5YjFlMzVkZjEz/OTQzMzg4N2E5N2Rh/YTY2Zi80LzUvNDU3/MzEwMjYzOTg5OS1z/LmguZmlndWFydHMt/c3BpZGVyLW1hbi1f/bWlsZXMtbW9yYWxl/c18tXzE1Xy5qcGc',
    releaseYear: 2024,
    rating: 4.8,
    price: 20.08,
    aliExpressUrl: 'https://www.aliexpress.us/item/3256808297690410.html?pdp_npi=4%40dis%21USD%21US%20%2432.60%21US%20%248.17%21%21%21238.84%2159.86%21%4021030ea417443248211983035ea22a%2112000046413984419%21sh%21US%210%21X&spm=a2g0o.store_pc_allItems_or_groupList.new_all_items_2007567562990.1005008484005162&gatewayAdapt=glo2usa'
  },
  {
    id: '14',
    name: 'CT Toys Symbiote Spider-man (Tobey Maguire)',
    image: 'https://imgs.search.brave.com/9bs1ySqZZ6JGbuxMp_FaZac-IPcJyZI-g79Gwpdqxb0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9wcmV2/aWV3LnJlZGQuaXQv/bmV3LWxvb2stYXQt/Y3QtdG95cy1zcGlk/ZXItbWFuLTMtc3lt/YmlvdGUtc3BpZGV5/LXYwLWt4eDdoOHV4/ZmZ2YzEucG5nP2F1/dG89d2VicCZzPThh/NTM0MjNiOGJmZTA1/MTgzNzU0ODk0NTJh/NmYzMWFiNTg2YmRm/OTg',
    releaseYear: 2024,
    rating: 4.8,
    price: 27.75,
    aliExpressUrl: 'https://www.aliexpress.us/item/3256807927773881.html?pdp_npi=4%40dis%21USD%21US%20%2432.83%21US%20%248.28%21%21%21240.48%2160.60%21%402101ef5e17443265196664022e491e%2112000045917576622%21sh%21US%210%21X&spm=a2g0o.store_pc_allItems_or_groupList.new_all_items_2007567562990.1005008114088633&gatewayAdapt=glo2usa'
  },
  {
    id: '15',
    name: 'CT Toys The Amazing Spider-Man Andrew Garfield (No Way Home)',
    image: 'https://ae-pic-a1.aliexpress-media.com/kf/S50eeb1085eac4d91bc91b749738d9416W.png_220x220.png_.avif',
    releaseYear: 2024,
    rating: 4.8,
    price: 27.75,
    aliExpressUrl: 'https://www.aliexpress.us/item/3256807927773881.html?pdp_npi=4%40dis%21USD%21US%20%2432.83%21US%20%248.28%21%21%21240.48%2160.60%21%402101ef5e17443265196664022e491e%2112000045917576622%21sh%21US%210%21X&spm=a2g0o.store_pc_allItems_or_groupList.new_all_items_2007567562990.1005008114088633&gatewayAdapt=glo2usa'
  },
  {
    id: '16',
    name: 'CT Toys Spider-man (Tobey)',
    image: 'https://i.ebayimg.com/images/g/OpYAAOSwXEVnJIEL/s-l1200.png',
    releaseYear: 2024,
    rating: 3.8,
    price: 15.95,
    aliExpressUrl: 'https://www.aliexpress.us/item/3256807127828489.html?spm=a2g0o.productlist.main.19.54705540CV5qHx&algo_pvid=08a40333-3c36-4f24-88b0-90c99e9ea999&algo_exp_id=08a40333-3c36-4f24-88b0-90c99e9ea999-9&pdp_ext_f=%7B%22order%22%3A%22531%22%2C%22eval%22%3A%221%22%7D&pdp_npi=4%40dis%21USD%2147.19%219.07%21%21%21345.71%2166.46%21%402101ea7117443253956107380ec5ff%2112000040225646012%21sea%21US%210%21ABX&curPageLogUid=qBSVqdz7LLQ5&utparam-url=scene%3Asearch%7Cquery_from%3A'
  },
  {
    id: '17',
    name: 'CT Toys Ultimate Gohan',
    image: 'https://ae-pic-a1.aliexpress-media.com/kf/Sf2b802c26c244379947032bdec8fa9c7V.jpg_220x220q75.jpg_.avif',
    releaseYear: 2024,
    rating: 4.5,
    price: 30.00,
    aliExpressUrl: 'https://www.aliexpress.us/item/3256807319037743.html?spm=a2g0o.productlist.main.13.51eb69d50CFQxW&algo_pvid=0f808b4c-655b-4bb8-992b-4aae74c61d21&algo_exp_id=0f808b4c-655b-4bb8-992b-4aae74c61d21-6&pdp_ext_f=%7B%22order%22%3A%2213%22%2C%22eval%22%3A%221%22%7D&pdp_npi=4%40dis%21USD%2187.22%2129.45%21%21%21632.96%21213.76%21%402101c5ac17452686612966209e4e53%2112000041057554030%21sea%21US%210%21ABX&curPageLogUid=NpuLFkK7fhTu&utparam-url=scene%3Asearch%7Cquery_from%3A'
  },
  {
    id: '18',
    name: 'CT Toys Gohan Scholar',
    image: 'https://ae-pic-a1.aliexpress-media.com/kf/S099da78d39d5454a8d4d4a0de341e643W.jpg_220x220q75.jpg_.avif',
    releaseYear: 2024,
    rating: 4.5,
    price: 30.00,
    aliExpressUrl: 'https://www.aliexpress.us/item/3256807319037743.html?spm=a2g0o.productlist.main.13.51eb69d50CFQxW&algo_pvid=0f808b4c-655b-4bb8-992b-4aae74c61d21&algo_exp_id=0f808b4c-655b-4bb8-992b-4aae74c61d21-6&pdp_ext_f=%7B%22order%22%3A%2213%22%2C%22eval%22%3A%221%22%7D&pdp_npi=4%40dis%21USD%2187.22%2129.45%21%21%21632.96%21213.76%21%402101c5ac17452686612966209e4e53%2112000041057554030%21sea%21US%210%21ABX&curPageLogUid=NpuLFkK7fhTu&utparam-url=scene%3Asearch%7Cquery_from%3A'
  },
  {
    id: '19',
    name: 'CT Toys Spiderman Mafex 075',
    image: 'https://ae-pic-a1.aliexpress-media.com/kf/Sff44da8f1b2341efb3fc515be662b6dd9.png_220x220.png_.avif',
    releaseYear: 2025,
    rating: 5.0, // No rating yet
    price: 20.31, // Price not available
    aliExpressUrl: 'https://www.aliexpress.us/item/3256808701880756.html?pdp_npi=4%40dis%21USD%21US%20%2439.67%21US%20%2439.67%21%21%21288.30%21288.30%21%402101c72a17454283703242152ee974%2112000047087935555%21sh%21US%210%21X&spm=a2g0o.store_pc_allItems_or_groupList.new_all_items_2007567562990.1005008888195508&gatewayAdapt=glo2usa',
  },
  {
    id: '20',
    name: 'AC Factory Ultron ',
    image: 'https://i0.wp.com/thefwoosh.com/wp-content/uploads/2015/09/Kaiyodo-Revo-Movie-002-Avengers-Ultron-Featured.jpg?ssl=1',
    releaseYear: 2025,
    rating: 5.0, // No rating yet
    price: 26.91, // Price not available
    aliExpressUrl: 'https://www.aliexpress.us/item/3256809222896418.html?spm=a2g0o.productlist.main.5.449f6a0dqhniVe&algo_pvid=c0384658-f6a9-484d-94ac-d439734568ba&algo_exp_id=c0384658-f6a9-484d-94ac-d439734568ba-4&pdp_ext_f=%7B%22order%22%3A%22-1%22%2C%22eval%22%3A%221%22%7D&pdp_npi=4%40dis%21USD%2153.82%2126.91%21%21%21383.59%21191.79%21%402101ea8c17518267007294221e239b%2112000049009844724%21sea%21US%211793174653%21X&curPageLogUid=QCKxgJHMW43v&utparam-url=scene%3Asearch%7Cquery_from%3A',
  },
  {
    id: '21',
    name: 'AC Factory Kaiyodo Revoltech Yamaguchi Catwoman ',
    image: 'https://m.media-amazon.com/images/I/41Iw8B4VWlL.jpg_BO30,255,255,255_UF900,850_SR1910,1000,0,C_QL100_.jpg',
    releaseYear: 2025,
    rating: 5.0, // No rating yet
    price: 29.45, // Price not available
    aliExpressUrl: 'https://www.aliexpress.us/item/3256809222896418.html?spm=a2g0o.productlist.main.5.449f6a0dqhniVe&algo_pvid=c0384658-f6a9-484d-94ac-d439734568ba&algo_exp_id=c0384658-f6a9-484d-94ac-d439734568ba-4&pdp_ext_f=%7B%22order%22%3A%22-1%22%2C%22eval%22%3A%221%22%7D&pdp_npi=4%40dis%21USD%2153.82%2126.91%21%21%21383.59%21191.79%21%402101ea8c17518267007294221e239b%2112000049009844724%21sea%21US%211793174653%21X&curPageLogUid=QCKxgJHMW43v&utparam-url=scene%3Asearch%7Cquery_from%3A',
  },
  {
    id: '21',
    name: 'AC Factory Kaiyodo Revoltech Yamaguchi Batman ',
    image: 'https://m.media-amazon.com/images/I/61af3K9DAbL.jpg',
    releaseYear: 2025,
    rating: 5.0, // No rating yet
    price: 29.84, // Price not available
    aliExpressUrl: 'https://www.aliexpress.us/item/3256808901384053.html?spm=a2g0o.productlist.main.8.16947f844C4zca&algo_pvid=df6a2bef-fa07-4076-8168-e057cc48e8b6&algo_exp_id=df6a2bef-fa07-4076-8168-e057cc48e8b6-7&pdp_ext_f=%7B%22order%22%3A%2213%22%2C%22eval%22%3A%221%22%7D&pdp_npi=4%40dis%21USD%2136.34%2136.34%21%21%21258.99%21258.99%21%402103205217518273610212531ed309%2112000047863277732%21sea%21US%211793174653%21X&curPageLogUid=DVPefFYZalHz&utparam-url=scene%3Asearch%7Cquery_from%3A',
  },
];



const RatingStars: React.FC<{ rating: number }> = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  return (
    <div className="flex items-center space-x-1">
      {[...Array(fullStars)].map((_, i) => (
        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      ))}
      {hasHalfStar && <StarHalf className="w-4 h-4 fill-yellow-400 text-yellow-400" />}
      {[...Array(5 - Math.ceil(rating))].map((_, i) => (
        <Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />
      ))}
      <span className="text-sm text-gray-600 ml-1">({rating})</span>
    </div>
  );
};

const Catalog: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'rating' | 'price'>('newest');
  const { user } = useAuth();
  const { isInCollection } = useCollection();

  const handleCollectionToggle = async (productId: string) => {
    if (!user) {
      alert("Please log in to add items to your collection");
      return;
    }

    try {
      const collectionDocRef = doc(db, `users/${user.uid}/collection`, productId);

      if (isInCollection(productId)) {
        await deleteDoc(collectionDocRef);
        alert("Removed from your collection");
      } else {
        const product = mockProducts.find((p) => p.id === productId);
        if (!product) {
          alert("Product not found");
          return;
        }

        await setDoc(collectionDocRef, {
          id: product.id,
          name: product.name,
          image: product.image,
          releaseYear: product.releaseYear,
          rating: product.rating,
          price: product.price,
          aliExpressUrl: product.aliExpressUrl,
          addedAt: new Date().toISOString(),
        });

        alert("Added to your collection");
      }
    } catch (error) {
      console.error("Error toggling collection:", error);
      alert("There was an error updating your collection");
    }
  };

  const filteredProducts = mockProducts
    .filter(product => 
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return b.releaseYear - a.releaseYear;
        case 'rating':
          return b.rating - a.rating;
        case 'price':
          return a.price - b.price;
        default:
          return 0;
      }
    });

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation */}
      <nav className="bg-black shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <a href="/" className="text-2xl font-bold text-white">CTVerse</a>
          </div>
        </div>
      </nav>

      {/* Search and Filter Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 space-y-4 md:space-y-0">
          <h1 className="text-3xl font-bold text-gray-800">CT Toys Catalog</h1>
          <div className="flex space-x-4 w-full md:w-auto">
            <div className="relative flex-1 md:flex-none">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search figures..."
                className="pl-10 pr-4 py-2 w-full md:w-64 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent appearance-none bg-white"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'newest' | 'rating' | 'price')}
              >
                <option value="newest">Newest First</option>
                <option value="rating">Highest Rated</option>
                <option value="price">Lowest Price</option>
              </select>
            </div>
          </div>
        </div>

        {/* Coming Soon Section */}
        <div className="mt-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Coming Soon</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {comingSoonProducts.map(product => (
              <div key={product.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="relative pb-[100%]">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{product.name}</h3>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Release Year: {product.releaseYear}</span>
                  </div>
                  <a
                    href={product.aliExpressUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-red-600 text-white py-2 px-4 rounded-lg flex items-center justify-center space-x-2 hover:bg-red-700 transition-colors duration-300"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span>View on AliExpress</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Current Releases</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-12">
          {filteredProducts.map(product => (
            <div key={product.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="relative pb-[100%]">
                <img
                  src={product.image}
                  alt={product.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{product.name}</h3>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Released: {product.releaseYear}</span>
                  <span className="text-lg font-bold text-red-600">${product.price}</span>
                </div>
                <RatingStars rating={product.rating} />
                <div className="mt-4 space-y-2">
                  <a
                    href={product.aliExpressUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-red-600 text-white py-2 px-4 rounded-lg flex items-center justify-center space-x-2 hover:bg-red-700 transition-colors duration-300"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span>Buy on AliExpress</span>
                  </a>
                  <button
                    onClick={() => handleCollectionToggle(product.id)}
                    className={`w-full py-2 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors duration-300 ${
                      isInCollection(product.id)
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                    }`}
                  >
                    {isInCollection(product.id) ? (
                      <>
                        <Check className="w-5 h-5" />
                        <span>In Collection</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-5 h-5" />
                        <span>Add to Collection</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Catalog;