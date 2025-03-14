import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

// 只返回空组件，让rewrites规则接管
export default function Home() {
  const router = useRouter();
  
  // 使用客户端导航重定向到landing页面
  useEffect(() => {
    router.push('/landing');
  }, [router]);
  
  // 返回一个加载指示器
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <p>加载中...</p>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'zh', ['common'])),
    },
  };
};