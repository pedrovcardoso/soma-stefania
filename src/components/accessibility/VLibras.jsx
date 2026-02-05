'use client';

import Script from 'next/script';
import useThemeStore from '@/store/useThemeStore';

export default function VLibrasComponent() {
    const vLibrasActive = useThemeStore(state => state.vLibrasActive);

    if (!vLibrasActive) return null;

    return (
        <>
            <div vw="true" className="left-0 top-1/2 -translate-y-1/2 !z-[9999]">
                <div vw-access-button="true" className="active"></div>
                <div vw-plugin-wrapper="true" className="active">
                    <div className="vw-plugin-top-wrapper"></div>
                </div>
            </div>
            <Script
                src="https://vlibras.gov.br/app/vlibras-plugin.js"
                strategy="afterInteractive"
                onLoad={() => {
                    if (window.VLibras) {
                        try {
                            new window.VLibras.Widget('https://vlibras.gov.br/app');
                        } catch (error) {
                            console.error('Failed to initialize VLibras widget:', error);
                        }
                    }
                }}
            />
        </>
    );
}
