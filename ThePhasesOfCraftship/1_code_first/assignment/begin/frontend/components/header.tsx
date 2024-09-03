import React from "react";
import { useRouter } from "next/router";
import logo from "../public/assets/dddforumlogo.png";
import Link from "next/link";
import Image from "next/image";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

const Logo = () => (
  <div id="app-logo">
    <Image src={logo} height={100} width={100} alt="logo" />
  </div>
);

const TitleAndSubmission = () => (
  <div id="title-container">
    <h1>Domain-Driven Designers</h1>
    <h3>Where awesome domain driven designers are made</h3>
    <Link href={"/registerPage"}>Submit</Link>
  </div>
);

const HeaderActionButton = ({ user }: { user: any }) => (
  <div id="header-action-button">
    {user ? (
      <div>
        <div>{user.username}</div>
        <u>
          <div>Logout</div>
        </u>
      </div>
    ) : (
      <Link href="/registerPage">Register</Link>
    )}
  </div>
);

const shouldShowActionButton = (pathName: string) => {
  return pathName !== "/registerPage";
};

export const Header = () => {
  const router = useRouter();
  const { pathname } = router;
  const user = useSelector((state: RootState) => state.user)

  return (
    <header id="header" className="flex align-center">
      <Logo />
      <TitleAndSubmission />
      {shouldShowActionButton(pathname) && (
        <HeaderActionButton user={user.isLoggedIn ? user : null} />
      )}
    </header>
  );
};
