import style from "../styles/pagesNav.module.css";
import {
  EmailOutlined,
  PermIdentityOutlined,
  OtherHousesOutlined,
  PeopleAltOutlined,
  OtherHouses,
  Email,
  Add,
  PeopleAlt,
  Person,
  Search,
} from "@mui/icons-material";
import { useEffect, useState } from "react";
import Modal from "./Modal";
import { useSelector } from "react-redux";
import SearchPeople from "./SearchPeople";
import Link from "next/link";
import { useRouter } from "next/router";

function PagesNav({ rotate = false, setModalOpened }) {
  const router = useRouter();
  const userData = useSelector((state) => state.auth);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [locationChanged, setLocationChanged] = useState(false);
  const [pathname, setPathname] = useState(null);
  const { id: queryId } = router.query;

  // get the URL pathname and set in the state
  useEffect(() => {
    if (locationChanged || true) {
      const pathname = window.location.pathname;
      if (queryId && queryId === userData.user._id) {
        setPathname(pathname.slice(1, pathname.length).split("/")[0]);
      } else setPathname(pathname.slice(1, pathname.length));
    }
  }, [locationChanged, userData.user?._id]);

  // // remove bottom page nav when a the windows height becomes smaller particularly when a virtual keyboard is displayed
  // useEffect(() => {
  //   const pageNav = document.querySelector(".pageNavAlt")
  //   const initialWindowHeight = window.innerHeight
  //   if(pathname !== 'login' && pathname !== 'signup' && pathname !== 'messaging' && pathname !== null) {
  //     if('visualViewport' in window) {
  //       window.visualViewport.addEventListener('resize', function() {
  //         if(window.innerHeight + 50 < initialWindowHeight) {
  //           pageNav.style.display = 'none'
  //         } else if (pathname !== 'login' && pathname !== 'signup' ) {
  //           pageNav.style.display = 'block'
  //         }
  //       })
  //     }
  //   }
  // }, [pathname])

  return (
    <div
      className={`${style.pagesNav} ${
        rotate ? style.pagesNavVertical : style.pageNavAlt
      }`}
      id="pageNav"
    >
      <div className={style.pagesNav__container}>
        <Link
          href="/"
          className={style.pagesNav__action}
          onClick={() => setLocationChanged(!locationChanged)}
        >
          {pathname === "" ? <OtherHouses /> : <OtherHousesOutlined />}
        </Link>
        <Link
          href="/messaging"
          className={`${style.pagesNav__action} ${style.remove}`}
          onClick={() => setLocationChanged(!locationChanged)}
        >
          {pathname === "messaging" ? <Email /> : <EmailOutlined />}
        </Link>
        <Link
          href="/followers"
          className={`${style.pagesNav__action} ${style.pageNav__follow}`}
          onClick={() => setLocationChanged(!locationChanged)}
        >
          {pathname === "followers" ? <PeopleAlt /> : <PeopleAltOutlined />}
        </Link>
        <div
          className={style.pagesNav__action}
          onClick={() => setSearchModalOpen(!searchModalOpen)}
        >
          <Search />
        </div>
        <Link
          href={`/profile/?id=${userData.user?._id}`}
          className={style.pagesNav__action}
          onClick={() => setLocationChanged(!locationChanged)}
        >
          {pathname === "profile" ? <Person /> : <PermIdentityOutlined />}
        </Link>
        {rotate && (pathname?.length === 0 || pathname === "profile") && (
          <Link
            href="#"
            className={`${style.pagesNav__action} ${style.addPost}`}
            onClick={() => setModalOpened(true)}
          >
            <Add />
          </Link>
        )}
      </div>
      <Modal
        open={searchModalOpen}
        onClose={() => {
          setSearchModalOpen(false);
        }}
        custom_modal={style.search_modal}
      >
        <SearchPeople
          userData={userData}
          setSearchModalOpen={setSearchModalOpen}
        />
      </Modal>
    </div>
  );
}

export default PagesNav;
