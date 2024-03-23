import './Loader.css'
export const Loader = () => {
    return (
        <div className="loader-container">
        <div className="loader-cube">
            <div className="loader-side front"></div>
            <div className="loader-side back"></div>
            <div className="loader-side left"></div>
            <div className="loader-side right"></div>
            <div className="loader-side top"></div>
            <div className="loader-side bottom"></div>
        </div>
        </div>
    );
}