// import { filterImageUrl } from '@/utils/helper';
import './index.less';

const Banner = ({ isLogin, imgsInfo = {} }) => {
    return (
        <div className="wrapper">
            <video
                src="https://ik.imagekit.io/mrmiss/1621796269869_EtsurM5nz.mp4"
                muted="muted"
                autoPlay="autoplay"
                loop
                style={{ width: '100%' }}
            >
                your browser does not support the video tag
            </video>
        </div>
    );
};

export default Banner;
