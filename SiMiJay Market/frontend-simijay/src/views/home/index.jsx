import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="container mt-5 pt-5">
      <div className="p-5 mb-4 bg-light rounded-3 shadow-sm">
        <div className="container-fluid py-5">
          <h1 className="display-5 fw-bold">Selamat Datang di SiMiJay Market</h1>
          <p className="col-md-12 fs-4">
            Website SiMijay Market
          </p>
          <hr />
          <Link to="/register" className="btn btn-primary btn-lg me-3">
            REGISTER
          </Link>
          <Link to="/login" className="btn btn-secondary btn-lg">
            LOGIN
          </Link>
        </div>
      </div>
    </div>
  );
}
