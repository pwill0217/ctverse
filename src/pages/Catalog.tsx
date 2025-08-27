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
    name: 'Mess Toys (CT Toys) Amazing Yamaguchi style Superior Spider-man (Otto Octavius)',
    image: 'https://ae-pic-a1.aliexpress-media.com/kf/S0d6067a16ef84ab1bb4c35732cb49c2eP.png_220x220.png_.avif',
    releaseYear: 2025,
    rating: 0, // No rating yet
    price: 57.27, 
    aliExpressUrl: 'https://www.aliexpress.us/item/3256808880852310.html?pdp_npi=4%40dis%21USD%21US%20%2481.76%21US%20%2425.79%21%21%21582.78%21183.85%21%402101c80217518214176695212ee5b3%2112000048421841569%21sh%21US%210%21X&spm=a2g0o.store_pc_allItems_or_groupList.new_all_items_2007567562990.1005009067167062&gatewayAdapt=glo2usa',
  },
{
    id: '102',
    name: 'CT Toys Daredevil Mafex 223',
    image: 'https://ae-pic-a1.aliexpress-media.com/kf/S896fad09198942b88331728cee7f19636.png_220x220.png_.avif',
    releaseYear: 2025,
    rating: 0, // No rating yet
    price: 25.15, 
    aliExpressUrl: 'https://www.aliexpress.us/item/3256809389538475.html?spm=a2g0o.productlist.main.9.60d7k9tYk9tY8S&algo_pvid=586ef6b8-5557-4830-bfec-61f0433da7a4&algo_exp_id=586ef6b8-5557-4830-bfec-61f0433da7a4-8&pdp_ext_f=%7B%22order%22%3A%22695%22%2C%22eval%22%3A%221%22%7D&pdp_npi=6%40dis%21USD%2174.21%2125.15%21%21%21527.79%21178.89%21%402101c5bf17563092681661264e5724%2112000049917430881%21sea%21US%210%21ABX%211%210%21n_tag%3A-29910%3Bd%3A1d1e8bbd%3Bm03_new_user%3A-29895%3BpisId%3A5000000174221210&curPageLogUid=DLqs6tK9fQLV&utparam-url=scene%3Asearch%7Cquery_from%3A%7Cx_object_id%3A1005009575853227%7C_p_origin_prod%3A',
  },
  {
    id: '103',
    name: 'AC Factory Ryu Hayabusa Kaiyodo Revoltech Amazing Yamaguchi Ninja Gaiden',
    image: 'https://ae-pic-a1.aliexpress-media.com/kf/Scdf7c3de2966462b9db3e6a7f7a52928w.png_220x220.png_.avif',
    releaseYear: 2025,
    rating: 0, // No rating yet
    price: 0, 
    aliExpressUrl: 'https://www.aliexpress.us/item/3256808672053556.html?spm=a2g0o.store_pc_home.promoteRecommendProducts_2005250127572.1005008858368308&gatewayAdapt=glo2usa4itemAdapt',
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
    price: 27.78,
    aliExpressUrl: 'https://www.aliexpress.us/item/3256808021472813.html?pdp_npi=4%40dis%21USD%21US%20%2450.13%21US%20%2416.06%21%21%21361.93%21115.94%21%402101c71a17439783646912876ecfa7%2112000046609828247%21sh%21US%210%21X&spm=a2g0o.store_pc_allItems_or_groupList.new_all_items_2007567562990.1005008207787565&gatewayAdapt=glo2usa'
  },
  {
    id: '3',
    name: 'CT Toys Spiderman (Ben Reilly)',
    image: 'https://imgs.search.brave.com/mPHTj-_MP9a0w4ReC38eUxdfjpAp91FIooTP92Kpy24/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLnJl/ZGQuaXQvcTI2Y2xt/cHJpOTVlMS5qcGVn',
    releaseYear: 2025,
    rating: 4.7,
    price: 28.70,
    aliExpressUrl: 'https://www.aliexpress.us/item/3256808014773986.html?pdp_npi=4%40dis%21USD%21US%20%2451.60%21US%20%2416.72%21%21%21372.59%21120.74%21%402101c71a17439783646912876ecfa7%2112000046412799421%21sh%21US%210%21X&spm=a2g0o.store_pc_allItems_or_groupList.new_all_items_2007567562990.1005008201088738&gatewayAdapt=glo2usa'
  },
  {
    id: '4',
    name: 'CT Toys Amazing Yamaguchi Spider-Man 2.0 ',
    image: 'https://imgs.search.brave.com/pQie4T6bNNwdkoWX5sipMSqzuKmmtkggJhggJBlEB_I/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/NjFRRkZxdWp0T0wu/anBn',
    releaseYear: 2025,
    rating: 4.9,
    price: 28.40,
    aliExpressUrl: 'https://www.aliexpress.us/item/3256808040974481.html?gps-id=pcStoreJustForYou&scm=1007.23125.137358.0&scm_id=1007.23125.137358.0&scm-url=1007.23125.137358.0&pvid=a2262d12-b744-4728-bc90-52961cef1dd9&_t=gps-id%3ApcStoreJustForYou%2Cscm-url%3A1007.23125.137358.0%2Cpvid%3Aa2262d12-b744-4728-bc90-52961cef1dd9%2Ctpp_buckets%3A668%232846%238111%231996&pdp_ext_f=%7B%22order%22%3A%221003%22%2C%22eval%22%3A%221%22%2C%22sceneId%22%3A%2213125%22%7D&pdp_npi=4%40dis%21USD%2151.56%2116.70%21%21%21377.75%21122.37%21%402101c80017443213727355204e8414%2112000045949435800%21rec%21US%21%21ABX&spm=a2g0o.store_pc_home.smartJustForYou_2005299976221.1005008227289233&gatewayAdapt=glo2usa'
  },
  {
    id: '5',
    name: 'CT Toys Wolverine (Tiger Stripe)',
    image: 'https://imgs.search.brave.com/OtEa6-TI9586RG-4zHwGGNbz8eFNgXQKCiFn6bUKMYQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9odHRw/Mi5tbHN0YXRpYy5j/b20vRF9RX05QXzJY/Xzk5NjgyNi1NTE04/MTczOTc2MjU0N18w/MTIwMjUtRS53ZWJw',
    releaseYear: 2025,
    rating: 4.8,
    price: 21.58,
    aliExpressUrl: 'https://www.aliexpress.us/item/3256807907572652.html?gps-id=pcStoreJustForYou&scm=1007.23125.137358.0&scm_id=1007.23125.137358.0&scm-url=1007.23125.137358.0&pvid=a2262d12-b744-4728-bc90-52961cef1dd9&_t=gps-id%3ApcStoreJustForYou%2Cscm-url%3A1007.23125.137358.0%2Cpvid%3Aa2262d12-b744-4728-bc90-52961cef1dd9%2Ctpp_buckets%3A668%232846%238111%231996&pdp_ext_f=%7B%22order%22%3A%221871%22%2C%22eval%22%3A%221%22%2C%22sceneId%22%3A%2213125%22%7D&pdp_npi=4%40dis%21USD%2148.75%2115.44%21%21%21357.15%21113.10%21%402101c80017443213727355204e8414%2112000046412771995%21rec%21US%21%21ABX&spm=a2g0o.store_pc_home.smartJustForYou_2005299976221.1005008093887404&gatewayAdapt=glo2usa'
  },
  {
    id: '6',
    name: 'CT Toys Wolverine (Brown Suit)',
    image: 'https://imgs.search.brave.com/oG2qJEEo43sM7rOYhfNCKLAAxUhA7qEt27HmHErLS58/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLmVi/YXlpbWcuY29tL2lt/YWdlcy9nL1N-c0FB/T1N3a345bX5oMEkv/cy1sNTAwLmpwZw',
    releaseYear: 2025,
    rating: 4.8,
    price: 21.58,
    aliExpressUrl: 'https://www.aliexpress.us/item/3256807907572652.html?gps-id=pcStoreJustForYou&scm=1007.23125.137358.0&scm_id=1007.23125.137358.0&scm-url=1007.23125.137358.0&pvid=a2262d12-b744-4728-bc90-52961cef1dd9&_t=gps-id%3ApcStoreJustForYou%2Cscm-url%3A1007.23125.137358.0%2Cpvid%3Aa2262d12-b744-4728-bc90-52961cef1dd9%2Ctpp_buckets%3A668%232846%238111%231996&pdp_ext_f=%7B%22order%22%3A%221871%22%2C%22eval%22%3A%221%22%2C%22sceneId%22%3A%2213125%22%7D&pdp_npi=4%40dis%21USD%2148.75%2115.44%21%21%21357.15%21113.10%21%402101c80017443213727355204e8414%2112000046412771995%21rec%21US%21%21ABX&spm=a2g0o.store_pc_home.smartJustForYou_2005299976221.1005008093887404&gatewayAdapt=glo2usa'
  },
  {
    id: '7',
    name: 'CT Toys Agent Venom Amazing Yamaguchi',
    image: 'https://imgs.search.brave.com/HShTDi8ZXZrh5JIM1n-7otKYKhP-0S_DuaK-RfL_qSk/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pNS53/YWxtYXJ0aW1hZ2Vz/LmNvbS9zZW8vQ1Qt/VG95cy1LYWl5YW5n/ZG8tUmV2b2x0ZWNo/LUFtYXppbmctWWFt/YWd1Y2hpLUFnZW50/LVZlbm9tLUFjdGlv/bi1GaWd1cmUtNmlu/LU5FV18zYzFhMGQx/OS03OTU1LTQxMTct/OGNkZi1kNDBiZTFm/MmNiOGUuN2M5Mzk4/ZWU1MDA4M2Q0YjVi/MjRiMTgxMzYxMTBl/MzEucG5nP29kbkhl/aWdodD02NDAmb2Ru/V2lkdGg9NjQwJm9k/bkJnPUZGRkZGRg',
    releaseYear: 2024,
    rating: 4.8,
    price: 34.57,
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
    rating: 4.7,
    price: 19.19,
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
    rating: 4.7,
    price: 27.17,
    aliExpressUrl: 'https://www.aliexpress.us/item/3256806805724106.html?gatewayAdapt=glo2usa4itemAdapt'
  },
  {
    id: '17',
    name: 'CT Toys Ultimate Gohan',
    image: 'https://ae-pic-a1.aliexpress-media.com/kf/Sf2b802c26c244379947032bdec8fa9c7V.jpg_220x220q75.jpg_.avif',
    releaseYear: 2024,
    rating: 4.5,
    price: 33.98,
    aliExpressUrl: 'https://www.aliexpress.com/item/1005008749253955.html?spm=a2g0o.store_pc_home.0.0.4e9e633c6C2Rhd'
  },
  {
    id: '18',
    name: 'CT Toys Gohan Scholar',
    image: 'https://ae-pic-a1.aliexpress-media.com/kf/S099da78d39d5454a8d4d4a0de341e643W.jpg_220x220q75.jpg_.avif',
    releaseYear: 2024,
    rating: 4.5,
    price: 33.98,
    aliExpressUrl: 'https://www.aliexpress.us/item/3256809297087347.html?pdp_npi=4%40dis%21USD%21US%20%2477.24%21US%20%2433.98%21%21%21549.38%21241.73%21%402103247417563129034065201eff77%2112000049932883484%21sh%21US%211793174653%21X&spm=a2g0o.store_pc_allItems_or_groupList.new_all_items_2007567562990.1005009483402099&gatewayAdapt=glo2usa'
  },
  {
    id: '19',
    name: 'CT Toys Spiderman Mafex 075',
    image: 'https://ae-pic-a1.aliexpress-media.com/kf/Sff44da8f1b2341efb3fc515be662b6dd9.png_220x220.png_.avif',
    releaseYear: 2025,
    rating: 5.0, // No rating yet
    price: 28.42, // Price not available
    aliExpressUrl: 'https://www.aliexpress.us/item/3256808701880756.html?pdp_npi=4%40dis%21USD%21US%20%2439.67%21US%20%2439.67%21%21%21288.30%21288.30%21%402101c72a17454283703242152ee974%2112000047087935555%21sh%21US%210%21X&spm=a2g0o.store_pc_allItems_or_groupList.new_all_items_2007567562990.1005008888195508&gatewayAdapt=glo2usa',
  },
  {
    id: '20',
    name: 'AC Factory Ultron ',
    image: 'https://i0.wp.com/thefwoosh.com/wp-content/uploads/2015/09/Kaiyodo-Revo-Movie-002-Avengers-Ultron-Featured.jpg?ssl=1',
    releaseYear: 2025,
    rating: 5.0, // No rating yet
    price: 35.03, // Price not available
    aliExpressUrl: 'https://www.aliexpress.us/item/3256809039642424.html?aff_fcid=10f0493a125f413592105f548d3bb442-1756313970846-04836-_omNgFIi&tt=CPS_NORMAL&aff_fsk=_omNgFIi&aff_platform=shareComponent-detail&sk=_omNgFIi&aff_trace_key=10f0493a125f413592105f548d3bb442-1756313970846-04836-_omNgFIi&terminal_id=897cee6e890346bbb3fcfdef4db1c69f&afSmartRedirect=y&gatewayAdapt=glo2usa4itemAdapt',
  },
  {
    id: '21',
    name: 'AC Factory Kaiyodo Revoltech Yamaguchi Catwoman ',
    image: 'https://m.media-amazon.com/images/I/41Iw8B4VWlL.jpg_BO30,255,255,255_UF900,850_SR1910,1000,0,C_QL100_.jpg',
    releaseYear: 2025,
    rating: 4.8, // No rating yet
    price: 29.33, // Price not available
    aliExpressUrl: 'https://www.aliexpress.us/item/3256809134441429.html?aff_fcid=277d01337ff44182b73e1dedbfbce4b6-1756314095254-01406-_oDIJXdj&tt=CPS_NORMAL&aff_fsk=_oDIJXdj&aff_platform=shareComponent-detail&sk=_oDIJXdj&aff_trace_key=277d01337ff44182b73e1dedbfbce4b6-1756314095254-01406-_oDIJXdj&terminal_id=897cee6e890346bbb3fcfdef4db1c69f&afSmartRedirect=y&gatewayAdapt=glo2usa4itemAdapt',
  },
  {
    id: '22',
    name: 'AC Factory Kaiyodo Revoltech Yamaguchi Batman ',
    image: 'https://m.media-amazon.com/images/I/61af3K9DAbL.jpg',
    releaseYear: 2025,
    rating: 5.0, // No rating yet
    price: 38.36, // Price not available
    aliExpressUrl: 'https://www.aliexpress.us/item/3256808901384053.html?spm=a2g0o.productlist.main.8.16947f844C4zca&algo_pvid=df6a2bef-fa07-4076-8168-e057cc48e8b6&algo_exp_id=df6a2bef-fa07-4076-8168-e057cc48e8b6-7&pdp_ext_f=%7B%22order%22%3A%2213%22%2C%22eval%22%3A%221%22%7D&pdp_npi=4%40dis%21USD%2136.34%2136.34%21%21%21258.99%21258.99%21%402103205217518273610212531ed309%2112000047863277732%21sea%21US%211793174653%21X&curPageLogUid=DVPefFYZalHz&utparam-url=scene%3Asearch%7Cquery_from%3A',
  },
  {
    id: '23',
    name: 'CT Toys Scarlet Spider',
    image: 'https://imgs.search.brave.com/OKEyYeOkO_OV7TbIF42zNAkuDQjXTQpUU3-P2pa2Zxc/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLmVi/YXlpbWcuY29tL2lt/YWdlcy9nL0d1TUFB/T1N3OHFwbkxJUlAv/cy1sNTAwLmpwZw',
    releaseYear: 2025,
    rating: 4.8,
    price: 30.48,
    aliExpressUrl: 'https://www.aliexpress.us/item/3256809019696929.html?gps-id=pcStoreNewArrivals&scm=1007.23409.271287.0&scm_id=1007.23409.271287.0&scm-url=1007.23409.271287.0&pvid=0c848723-99af-4956-ba33-ad23e8970638&_t=gps-id%3ApcStoreNewArrivals%2Cscm-url%3A1007.23409.271287.0%2Cpvid%3A0c848723-99af-4956-ba33-ad23e8970638%2Ctpp_buckets%3A668%232846%238115%232000&pdp_ext_f=%7B%22order%22%3A%2231%22%2C%22eval%22%3A%221%22%2C%22sceneId%22%3A%2213409%22%7D&pdp_npi=4%40dis%21USD%2163.09%2128.38%21%21%21449.67%21202.28%21%402103244617518376012988647e6b3a%2112000048374131934%21rec%21US%21%21ABX&spm=a2g0o.store_pc_home.smartNewArrivals_2005299976220.1005009206011681&gatewayAdapt=glo2usa'
  },
  {
    id: '24',
    name: 'CT Toys Batman Mafex 126 ',
    image: 'https://i.ebayimg.com/images/g/uRIAAOSw~QVoUoTo/s-l960.webp',
    releaseYear: 2025,
    rating: 4.8, 
    price: 30.51, 
    aliExpressUrl: 'https://www.aliexpress.us/item/3256809120640751.html?pdp_npi=4%40dis%21USD%21US%20%2477.48%21US%20%2421.87%21%21%21552.26%21155.86%21%402101ef7017518212177115700ebd38%2112000048688659224%21sh%21US%210%21X&spm=a2g0o.store_pc_allItems_or_groupList.new_all_items_2007567562990.1005009306955503&gatewayAdapt=glo2usa',
  },
  {
    id: '25',
    name: 'Mess Toys (CT Toys) Amazing Yamaguchi style Symbiote Spider-man',
    image: 'https://ae-pic-a1.aliexpress-media.com/kf/S7cff800437cb4f29b7ad831dfdc84aacx.jpg_220x220q75.jpg_.avif',
    releaseYear: 2025,
    rating: 4.9, // No rating yet
    price: 37.63, // Price not available
    aliExpressUrl: 'https://www.aliexpress.us/item/3256808269057526.html?spm=a2g0o.productlist.main.4.726355e8j0Db4n&aem_p4p_detail=202508270923042859102807215670000296100&algo_pvid=c3482fb4-4395-4e17-80e4-a454b7c74358&algo_exp_id=c3482fb4-4395-4e17-80e4-a454b7c74358-3&pdp_ext_f=%7B%22order%22%3A%223553%22%2C%22eval%22%3A%221%22%7D&pdp_npi=6%40dis%21USD%2185.52%2130.13%21%21%21608.22%21214.28%21%402101c59817563117842186612edd05%2112000049917171402%21sea%21US%210%21ABX%211%210%21n_tag%3A-29910%3Bd%3A1d1e8bbd%3Bm03_new_user%3A-29895%3BpisId%3A5000000174221210&curPageLogUid=A1rBDpTHmq3P&utparam-url=scene%3Asearch%7Cquery_from%3A%7Cx_object_id%3A1005008455372278%7C_p_origin_prod%3A&search_p4p_id=202508270923042859102807215670000296100_1',
  },
  
  {
    id: '26',
    name: 'Mess Toys (CT Toys) Amazing Yamaguchi style Scarlet Spider (Kaine Parker)',
    image: 'https://i.ebayimg.com/images/g/mKcAAOSwUqdoWM2H/s-l1200.jpg',
    releaseYear: 2025,
    rating: 4.9, 
    price: 37.68, 
    aliExpressUrl: 'https://www.aliexpress.us/item/3256808269057526.html?spm=a2g0o.productlist.main.4.726355e8j0Db4n&aem_p4p_detail=202508270923042859102807215670000296100&algo_pvid=c3482fb4-4395-4e17-80e4-a454b7c74358&algo_exp_id=c3482fb4-4395-4e17-80e4-a454b7c74358-3&pdp_ext_f=%7B%22order%22%3A%223553%22%2C%22eval%22%3A%221%22%7D&pdp_npi=6%40dis%21USD%2185.52%2130.13%21%21%21608.22%21214.28%21%402101c59817563117842186612edd05%2112000049917171402%21sea%21US%210%21ABX%211%210%21n_tag%3A-29910%3Bd%3A1d1e8bbd%3Bm03_new_user%3A-29895%3BpisId%3A5000000174221210&curPageLogUid=A1rBDpTHmq3P&utparam-url=scene%3Asearch%7Cquery_from%3A%7Cx_object_id%3A1005008455372278%7C_p_origin_prod%3A&search_p4p_id=202508270923042859102807215670000296100_1',
  },
  {
    id: '27',
    name: 'CT Toys  Spider-Punk (SH Figuarts style)',
    image: 'https://ae-pic-a1.aliexpress-media.com/kf/S3384fb6c9b44438dab58de41cde709baS.png_220x220.png_.avif',
    releaseYear: 2025,
    rating: 5.0, // No rating yet
    price: 27.70, 
    aliExpressUrl: 'https://www.aliexpress.us/item/3256808672053556.html?spm=a2g0o.store_pc_home.promoteRecommendProducts_2005250127572.1005008858368308&gatewayAdapt=glo2usa4itemAdapt',
  },
  {
    id: '28',
    name: 'KO Harley Quinn Amazing Yamaguchi',
    image: 'https://ae-pic-a1.aliexpress-media.com/kf/S777f16eb05624791822795529086e7d7w.jpg_220x220q75.jpg_.avif',
    releaseYear: 2025,
    rating: 4.5, // No rating yet
    price: 27.27, 
    aliExpressUrl: 'https://www.aliexpress.us/item/3256807434335448.html?aff_fcid=21cf9edf77c6424db21371ee316c3b67-1756315105655-07775-_oCGrjbf&tt=CPS_NORMAL&aff_fsk=_oCGrjbf&aff_platform=shareComponent-detail&sk=_oCGrjbf&aff_trace_key=21cf9edf77c6424db21371ee316c3b67-1756315105655-07775-_oCGrjbf&terminal_id=897cee6e890346bbb3fcfdef4db1c69f&afSmartRedirect=y&gatewayAdapt=glo2usa4itemAdapt',
  },
  {
    id: '29',
    name: 'KO Spiderman 2099 Mafex 239',
    image: 'https://m.media-amazon.com/images/I/3130ZVeieYL.jpg',
    releaseYear: 2025,
    rating: 0, // No rating yet
    price: 35.26, 
    aliExpressUrl: 'https://www.aliexpress.us/item/3256807434335448.html?aff_fcid=21cf9edf77c6424db21371ee316c3b67-1756315105655-07775-_oCGrjbf&tt=CPS_NORMAL&aff_fsk=_oCGrjbf&aff_platform=shareComponent-detail&sk=_oCGrjbf&aff_trace_key=21cf9edf77c6424db21371ee316c3b67-1756315105655-07775-_oCGrjbf&terminal_id=897cee6e890346bbb3fcfdef4db1c69f&afSmartRedirect=y&gatewayAdapt=glo2usa4itemAdapt',
  },
  {
    id: '30',
    name: 'CT Anti Agent Venom Amazing Yamaguchi style',
    image: 'https://ae01.alicdn.com/kf/S1df8da894bee40509f0d4f52ffa0473bP.jpg',
    releaseYear: 2025,
    rating: 4.9, // No rating yet
    price: 34.50, 
    aliExpressUrl: 'https://www.aliexpress.us/item/3256807434335448.html?aff_fcid=21cf9edf77c6424db21371ee316c3b67-1756315105655-07775-_oCGrjbf&tt=CPS_NORMAL&aff_fsk=_oCGrjbf&aff_platform=shareComponent-detail&sk=_oCGrjbf&aff_trace_key=21cf9edf77c6424db21371ee316c3b67-1756315105655-07775-_oCGrjbf&terminal_id=897cee6e890346bbb3fcfdef4db1c69f&afSmartRedirect=y&gatewayAdapt=glo2usa4itemAdapt',
  },
  {
    id: '31',
    name: 'Defect Mafex Iron man 165',
    image: 'https://ae-pic-a1.aliexpress-media.com/kf/Sea5bbdc12d304ddda3e714325991aadeG.jpg_960x960q75.jpg_.avif',
    releaseYear: 2025,
    rating: 4.1, // No rating yet
    price: 51.11, 
    aliExpressUrl: 'https://www.aliexpress.us/item/3256807434335448.html?aff_fcid=21cf9edf77c6424db21371ee316c3b67-1756315105655-07775-_oCGrjbf&tt=CPS_NORMAL&aff_fsk=_oCGrjbf&aff_platform=shareComponent-detail&sk=_oCGrjbf&aff_trace_key=21cf9edf77c6424db21371ee316c3b67-1756315105655-07775-_oCGrjbf&terminal_id=897cee6e890346bbb3fcfdef4db1c69f&afSmartRedirect=y&gatewayAdapt=glo2usa4itemAdapt',
  },
  {
    id: '32',
    name: 'Defect Mafex Thor 182',
    image: 'https://ae-pic-a1.aliexpress-media.com/kf/S4f68709a35a647f4bd2e1e9cd9841bb5o.jpg_960x960q75.jpg_.avif',
    releaseYear: 2025,
    rating: 0, // No rating yet
    price: 33.94, 
    aliExpressUrl: 'https://www.aliexpress.us/item/3256809557661523.html?spm=a2g0o.cart.similar_items.3.266238daUePnVR&utparam-url=scene%3Aimage_search%7Cquery_from%3Acart_soldout_item%7Cx_object_id%3A1005009743976275%7C_p_origin_prod%3A&algo_pvid=689ae03c-0b25-4e90-819d-55aa6eeb1e3b&algo_exp_id=689ae03c-0b25-4e90-819d-55aa6eeb1e3b&pdp_ext_f=%7B%22order%22%3A%228%22%7D&pdp_npi=6%40dis%21USD%2170.71%2133.94%21%21%21502.92%21241.40%21%402103245417563160704188633ee8ef%2112000050017552847%21sea%21US%211793174653%21X%211%210%21n_tag%3A-29919%3Bd%3A1d1e8bbd%3Bm03_new_user%3A-29895&gatewayAdapt=4itemAdapt',
  },
  {
    id: '33',
    name: 'Defect Mafex Knightfall Batman 215',
    image: 'https://ae-pic-a1.aliexpress-media.com/kf/S6ca784e9cafd4e78bcf4b216fb62f2bf9.jpg_960x960q75.jpg_.avif',
    releaseYear: 2025,
    rating: 4.0, // No rating yet
    price: 47.53, 
    aliExpressUrl: 'https://www.aliexpress.us/item/3256809436223859.html?spm=a2g0o.store_pc_home.0.0.8b6746f1nYeS5M&gatewayAdapt=glo2usa4itemAdapt',
  },
   {
    id: '34',
    name: 'Defect Mafex Armored Batman 193',
    image: 'https://ae-pic-a1.aliexpress-media.com/kf/Sf355eb1a842a4c6697d160c8027117fe6.jpg_960x960q75.jpg_.avif',
    releaseYear: 2025,
    rating: 0, // No rating yet
    price: 49.68, 
    aliExpressUrl: 'https://www.aliexpress.us/item/3256809592369183.html?spm=a2g0o.store_pc_home.0.0.696f46f1K94SET&gps-id=pcStoreJustForYou&scm=1007.23125.137358.0&scm_id=1007.23125.137358.0&scm-url=1007.23125.137358.0&pvid=620526b6-cd0f-411c-868a-663c10fc59d7&_t=gps-id%3ApcStoreJustForYou%2Cscm-url%3A1007.23125.137358.0%2Cpvid%3A620526b6-cd0f-411c-868a-663c10fc59d7%2Ctpp_buckets%3A668%232846%238108%231977&pdp_ext_f=%7B%22order%22%3A%22-1%22%2C%22eval%22%3A%221%22%2C%22sceneId%22%3A%2213125%22%7D&pdp_npi=6%40dis%21USD%2199.36%2149.68%21%21%21706.69%21353.34%21%402103205217563164881943779e1a76%2112000050132299552%21rec%21US%211793174653%21X%211%210%21n_tag%3A-29919%3Bd%3A1d1e8bbd%3Bm03_new_user%3A-29895&gatewayAdapt=glo2usa',
  },
];
// Treat both "CT Toys" and "Mess Toys" as CT Toys
// Treat "CT Toys", "Mess Toys", and standalone "CT" as CT Toys (word boundaries avoid matching "Factory")
const isCT = (name: string) => /\b(ct toys|mess toys|ct)\b/i.test(name);
const isDefect = (name: string) => /\bdefect\b/i.test(name);


// Split once
const ctToysProductsAll = mockProducts.filter(p => isCT(p.name));
const defectProductsAll    = mockProducts.filter(p => isDefect(p.name));
const nonCtToysProductsAll = mockProducts.filter(p => !isCT(p.name) && !isDefect(p.name));


// Reuse your search + sort for any list
const applyFilters = (list: Product[], search: string, sortBy: 'newest'|'rating'|'price') =>
  list
    .filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest': return b.releaseYear - a.releaseYear;
        case 'rating': return b.rating - a.rating;
        case 'price':  return a.price - b.price;
        default:       return 0;
      }
    });






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

const ctToysProducts    = applyFilters(ctToysProductsAll, searchQuery, sortBy);
const defectProducts    = applyFilters(defectProductsAll,   searchQuery, sortBy);
const nonCtToysProducts = applyFilters(nonCtToysProductsAll, searchQuery, sortBy);



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

{/* CT Toys Section */}
<h2 className="text-3xl font-bold text-gray-800 mb-6">CT Toys</h2>
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
  {ctToysProducts.map(product => (
    <div key={product.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="relative pb-[100%]">
        <img src={product.image} alt={product.name} className="absolute inset-0 w-full h-full object-cover" />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{product.name}</h3>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">Released: {product.releaseYear}</span>
          <span className="text-lg font-bold text-red-600">${product.price}</span>
        </div>
        <RatingStars rating={product.rating} />
        <div className="mt-4 space-y-2">
          <a href={product.aliExpressUrl} target="_blank" rel="noopener noreferrer"
             className="w-full bg-red-600 text-white py-2 px-4 rounded-lg flex items-center justify-center space-x-2 hover:bg-red-700 transition-colors duration-300">
            <ShoppingCart className="w-5 h-5" />
            <span>Buy on AliExpress</span>
          </a>
          <button
            onClick={() => handleCollectionToggle(product.id)}
            className={`w-full py-2 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors duration-300 ${
              isInCollection(product.id) ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            {isInCollection(product.id) ? (<><Check className="w-5 h-5" /><span>In Collection</span></>) : (<><Plus className="w-5 h-5" /><span>Add to Collection</span></>)}
          </button>
        </div>
      </div>
    </div>
  ))}
</div>
        {/* Non CT Toys Section */}
<div className="mt-12">
  <h2 className="text-3xl font-bold text-gray-800 mb-6">Non CT Toys</h2>
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {nonCtToysProducts.map(product => (
      <div key={product.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <div className="relative pb-[100%]">
          <img src={product.image} alt={product.name} className="absolute inset-0 w-full h-full object-cover" />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">{product.name}</h3>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Released: {product.releaseYear}</span>
            <span className="text-lg font-bold text-red-600">${product.price}</span>
          </div>
          <RatingStars rating={product.rating} />
          <div className="mt-4 space-y-2">
            <a href={product.aliExpressUrl} target="_blank" rel="noopener noreferrer"
               className="w-full bg-red-600 text-white py-2 px-4 rounded-lg flex items-center justify-center space-x-2 hover:bg-red-700 transition-colors duration-300">
              <ShoppingCart className="w-5 h-5" />
              <span>Buy on AliExpress</span>
            </a>
            <button
              onClick={() => handleCollectionToggle(product.id)}
              className={`w-full py-2 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors duration-300 ${
                isInCollection(product.id) ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              {isInCollection(product.id) ? (<><Check className="w-5 h-5" /><span>In Collection</span></>) : (<><Plus className="w-5 h-5" /><span>Add to Collection</span></>)}
            </button>
          </div>
        </div>
      </div>
    ))}
  </div>
</div>
{/* Defect Section */}
<h2 className="text-3xl font-bold text-gray-800 mb-6">Defect</h2>
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
  {defectProducts.map(product => (
    <div key={product.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="relative pb-[100%]">
        <img src={product.image} alt={product.name} className="absolute inset-0 w-full h-full object-cover" />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{product.name}</h3>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">Released: {product.releaseYear}</span>
          <span className="text-lg font-bold text-red-600">${product.price}</span>
        </div>
        <RatingStars rating={product.rating} />
        <div className="mt-4 space-y-2">
          <a href={product.aliExpressUrl} target="_blank" rel="noopener noreferrer"
             className="w-full bg-red-600 text-white py-2 px-4 rounded-lg flex items-center justify-center space-x-2 hover:bg-red-700 transition-colors duration-300">
            <ShoppingCart className="w-5 h-5" />
            <span>Buy on AliExpress</span>
          </a>
          <button
            onClick={() => handleCollectionToggle(product.id)}
            className={`w-full py-2 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors duration-300 ${
              isInCollection(product.id) ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            {isInCollection(product.id) ? (<><Check className="w-5 h-5" /><span>In Collection</span></>) : (<><Plus className="w-5 h-5" /><span>Add to Collection</span></>)}
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