(window.webpackJsonp=window.webpackJsonp||[]).push([[24],{425:function(t,s,a){"use strict";a.r(s);var n=a(2),e=Object(n.a)({},(function(){var t=this,s=t._self._c;return s("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[s("h2",{attrs:{id:"翻转链表"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#翻转链表"}},[t._v("#")]),t._v(" 翻转链表")]),t._v(" "),s("p",[t._v("递归和迭代两种方式，注意递归中关于"),s("code",[t._v("head.next")]),t._v("的处理")]),t._v(" "),s("div",{staticClass:"language-java line-numbers-mode"},[s("pre",{pre:!0,attrs:{class:"language-java"}},[s("code",[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("public")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("ListNode")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("reverseList")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("ListNode")]),t._v(" head"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("if")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("head "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("==")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("null")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("||")]),t._v(" head"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("next "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("==")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("null")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n        "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("return")]),t._v(" head"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("ListNode")]),t._v(" next "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("reverseList")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("head"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("next"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("head"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("next"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("next "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" head"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("next "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("null")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("return")]),t._v(" next"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])]),t._v(" "),s("div",{staticClass:"line-numbers-wrapper"},[s("span",{staticClass:"line-number"},[t._v("1")]),s("br"),s("span",{staticClass:"line-number"},[t._v("2")]),s("br"),s("span",{staticClass:"line-number"},[t._v("3")]),s("br"),s("span",{staticClass:"line-number"},[t._v("4")]),s("br"),s("span",{staticClass:"line-number"},[t._v("5")]),s("br"),s("span",{staticClass:"line-number"},[t._v("6")]),s("br"),s("span",{staticClass:"line-number"},[t._v("7")]),s("br"),s("span",{staticClass:"line-number"},[t._v("8")]),s("br")])]),s("h2",{attrs:{id:"链表环问题"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#链表环问题"}},[t._v("#")]),t._v(" 链表环问题")]),t._v(" "),s("p",[s("a",{attrs:{href:"https://leetcode.cn/problems/c32eOV/",target:"_blank",rel:"noopener noreferrer"}},[t._v("链表中环入口的判断"),s("OutboundLink")],1),s("br"),t._v("\n用个Set可以确认是否有环或者找环的起点，这里主要考虑快慢指针找环起点"),s("br"),t._v("\n我们定义这么几个点：起点"),s("code",[t._v("start")]),t._v("、环的起点"),s("code",[t._v("in")]),t._v("、快慢指针找环时相遇的点"),s("code",[t._v("meet")]),t._v("，我们定义环长"),s("code",[t._v("r")]),t._v("，两点之间的距离用类似"),s("code",[t._v("start2in")]),t._v("这种形式表示，则根据快指针是慢指针速度2倍，可以得到在相遇时")]),t._v(" "),s("ul",[s("li",[t._v("2 * (start2in + in2meet) = start2in + in2meet+n*r")]),t._v(" "),s("li",[t._v("-> start2in + in2meet = n*r")]),t._v(" "),s("li",[t._v("-> start2in + in2meet = (n-1) * r + in2meet + meet2in")]),t._v(" "),s("li",[t._v("-> start2in = (n - 1) * r + meet2in")]),t._v(" "),s("li",[t._v("最后一行可以理解为，从起点到入口的距离，刚好等于从相遇点绕环n圈后再次走到起点的距离，因此当我们找到相遇点后，可以让两个指针分别从相遇点和起点前进，最终它们会在入口汇合")])])])}),[],!1,null,null,null);s.default=e.exports}}]);