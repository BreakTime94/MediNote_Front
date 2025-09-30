import React from "react";
import AsideNav from "./AsideNav.jsx";

const demoItems = [
    { id: "overview", label: "개요" },
    { id: "features", label: "주요 기능" },
    { id: "pricing", label: "요금제" },
    { id: "faq", label: "FAQ" },
];

function DemoPage({ children }) {
    return (
        <div className="mx-auto max-w-7xl grid grid-cols-[280px_1fr] gap-6 p-6 min-h-screen items-start">
            {children}
        </div>
    );
}

function Section({ id, title, lines = 16 }) {
    return (
        <section id={id} className="scroll-mt-28">
            <h2 className="text-xl font-bold mb-3">{title}</h2>
            <div className="prose max-w-none">
                {[...Array(lines)].map((_, i) => (
                    <p key={i} className="text-gray-600">
                        더미 텍스트 {i + 1}. 스크롤 테스트용 문단입니다.
                    </p>
                ))}
            </div>
            <hr className="my-8" />
        </section>
    );
}

export default {
    title: "TEST/nav/AsideNav",
    component: AsideNav,
    parameters: {
        layout: "fullscreen",
        reactRouterPath: "/",
        reactExtraPath: [],
    },
    argTypes: {
        title: { control: "text" },
        subtitle: { control: "text" },
        "sticky.enabled": { control: "boolean", name: "sticky.enabled" },
        "sticky.top": { control: "number", name: "sticky.top" },
        "sticky.width": { control: "number", name: "sticky.width" },
        "scroll.offset": { control: "number", name: "scroll.offset" },
        "scroll.smooth": { control: "boolean", name: "scroll.smooth" },
        "scroll.spy": { control: "boolean", name: "scroll.spy" },
        "scroll.syncHash": { control: "boolean", name: "scroll.syncHash" },
    },
};

// Template: aside는 왼쪽(고정폭), main은 오른쪽(가변폭)
const Template = (args) => (
    <DemoPage>
        <aside className="w-[260px]">
            <AsideNav {...args} />
        </aside>

        <main className="bg-white border rounded-2xl p-6 shadow-sm">
            <Section id="overview" title="개요" />
            <Section id="features" title="주요 기능" />
            <Section id="pricing" title="요금제" />
            <Section id="faq" title="FAQ" />
        </main>
    </DemoPage>
);

export const Basic = Template.bind({});
Basic.args = {
    title: "문서 목차",
    subtitle: "스크롤과 선택 상태 동기화",
    items: demoItems,
    sticky: { enabled: true, top: 96, width: 260 },
    scroll: { offset: 80, smooth: true, spy: true, syncHash: false },
    ui: {
        activeGradientClass: "bg-grad-main",
        inactiveHoverClass: "hover:bg-gray-50",
        buttonHeightClass: "h-11",
    },
};

export const NoSticky = Template.bind({});
NoSticky.args = {
    ...Basic.args,
    sticky: { enabled: false },
};

export const CustomGradient = Template.bind({});
CustomGradient.args = {
    ...Basic.args,
    ui: {
        ...Basic.args.ui,
        activeGradientClass: "bg-gradient-to-r from-[#ff9bd4] to-[#c89cff]",
    },
};