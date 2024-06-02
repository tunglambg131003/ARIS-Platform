import React from 'react';
import Image from 'next/image';
import home from '@/src/theme/home_page/home.png'
import playlist from '@/src/theme/home_page/playlist.png';
import recent from '@/src/theme/home_page/recent.png';
import history from '@/src/theme/home_page/history.png';
import classes from '@/styles/HomePageTest.module.css';
import { useRouter } from 'next/navigation';
import user from '@/src/theme/home_page/user.png';
import { useSession } from 'next-auth/react';

function Sidebargeneral() {
  const router = useRouter();

  const asset = () => {
    router.push('/assetspage');
  };

  const redirectToHomePage = () => {
    router.push('/home'); // Assuming 'HomePage' is the route for your homepage
  };

  const { data: session } = useSession();

  return (
    <div>
<section id="nav-bar" className={classes.main_nav_bar}>
  <section id="nav-box-upper" className={classes.main_nav_box_upper}>
    <button className={classes.main_sign_in_box}>
      <Image
        src={user}
        width={24}
        height={24}
        alt="user"
        className={classes.main_button_settings}
      />
      <span className={classes.nav_text}>
        {session?.user?.email || 'Profile'}
      </span>
    </button>
  </section>
  
  <section className={classes.nav_body}>
    <section className={classes.nav_box} onClick={redirectToHomePage}>
      <Image
        src={home}
        alt="Home"
        width={24}
        height={24}
        className={classes.main_yticon}
      />
      <h3 className={classes.nav_text}>Home</h3>
    </section>
    <section className={classes.nav_box} onClick={asset}>
      <Image
        src={playlist}
        alt="Assets"
        width={24}
        height={24}
        className={classes.main_yticon}
      />
      <h3 className={classes.nav_text}>Assets</h3>
    </section>
    <section className={classes.nav_box}>
      <Image
        src={recent}
        alt="Library"
        width={24}
        height={24}
        className={classes.main_yticon}
      />
      <h3 className={classes.nav_text}>Library</h3>
    </section>
    <section className={classes.nav_box}>
      <Image
        src={history}
        alt="History"
        width={24}
        height={24}
        className={classes.main_yticon}
      />
      <h3 className={classes.nav_text}>History</h3>
    </section>
  </section>
</section>

    </div>
  );
}

export default Sidebargeneral;
