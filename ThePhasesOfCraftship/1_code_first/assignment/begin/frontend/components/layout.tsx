import React from 'react';
import { Header } from './header';

export const Content = ({ children }: any) => (
  <div className='content-container'>
    {children}
  </div>
)

export const Layout = ({ children }: any) => (
  <>
    <Header user={children}/>
    <Content>
      {children}
    </Content>
  </>
)