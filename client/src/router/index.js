import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import World from '@/pages/World'
import Discuss from '@/pages/discuss'
import Samecity from '@/pages/samecity'
import Me from '@/pages/me'
import Infocenter from '@/pages/infocenter'
import notFound from "@/components/notFound/notFound";
import Postings from "@/pages/moreoperation/postings";
import Liaotian from "@/pages/moreoperation/liaotian";
import Kongjian from "@/pages/moreoperation/kongjian";
import BianJi from "@/pages/moreoperation/bianji";

Vue.use(Router)


export default new Router({
  routes: [
    {
      path: "/login",
      name: "Login",
      component: Login
    },
    {
      path: "/kongjian/:name",
      name: "Kongjian",
      component: Kongjian
    },
    {
      path: "/bianJi/:id",
      name: "BianJi",
      component: BianJi
    },
    {
      path: "/world",
      name: "World",
      component: World
    },
    {
      path: "/discuss",
      name: "Discuss",
      component: Discuss,
    },
    {
      path: "/samecity",
      name: "Samecity",
      component: Samecity
    },
    {
      path: "/me",
      name: "Me",
      component: Me
    },
    {
      path: "/postings",
      name: "Postings",
      component: Postings
    },
    {
      path: "/liaotian",
      name: "Liaotian",
      component: Liaotian
    },
    {
      path: "/infocenter",
      name: "Infocenter",
      component: Infocenter
    },
    {
      path: "/",
      redirect: "/login"
    },
    //定义一个页面找不到的组件
    {
      path: "*",
      component: notFound
    }
  ]
});
