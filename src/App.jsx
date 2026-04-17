import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import AdminDashboard from './AdminPages/AdminDashboard';
import DevoteeMaster from './pages/DevoteeMater';
import DevoteeDirectory from './pages/DevoteeDirectory';
import BookSeva from './pages/BookSeva';
import BookingManager from './pages/BookingManager';
import PriestMaster from './AdminPages/PriestMaster';
import PriestDirectory from './pages/PriestDirectory';
import AddCategory from './AdminPages/components/AddCategory';
import AdminNavbar from './components/Navbar/AdminNavbar';
import PropertyManager from './AdminPages/PropertyManager';
import AssetManagement from './AdminPages/AssetManagement';
import AssetDirectory from './AdminPages/AssetDirectory';
import AssetDetail from './AdminPages/components/AssetDetail';
import TempleBranchMaster from './AdminPages/TempleBranchMaster';
import BranchDetail from './AdminPages/BranchDetail';
import BranchDirectory from './AdminPages/BranchDirectory';
import BookProperty from './pages/BookProperty';
import UserManager from './AdminPages/UserManager';
import BoardManager from './AdminPages/BoardManager';
import BranchBankingForm from './AdminPages/BranchBankingForm';
import BranchBankingView from './AdminPages/BranchBankingView';
import EventDetailsForm from './AdminPages/EventDetailsForm';
import EventDetailsView from './AdminPages/EventDetailsView';
import DocumentUpload from './AdminPages/DocumentUpload';
import DocumentDetails from './AdminPages/DocumentDetails';
import DocumentDirectory from './AdminPages/DocumentDirectory';
import ProjectRegistry from './AdminPages/ProjectRegistry';
import DevoteeNavbar from './components/Navbar/DevoteeNavbar';
import ProjectDirectory from './AdminPages/ProjectDirectory';
import DevoteeRegistration from './DevoteePages/DevoteeRegistration';
import DevoteeWelcome from './DevoteePages/DevoteeWelcome';
import PersonnelDashboard from './AdminPages/PersonnelDashboad';
import BookingDirectory from './DevoteePages/BookingDirectory';

function App() {
  return (

    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />

     
      <Route
        path="/sevas"
        element={
          <ProtectedRoute role="MANAGER">
          <BookSeva />
          </ProtectedRoute>
        }

      />

       <Route
        path="/BookingManager"
        element={
          <ProtectedRoute role="MANAGER">
          <BookingManager  navbar={<DevoteeNavbar/>}/>
          </ProtectedRoute>
        }

      />

      <Route
        path="/DevoteeMaster"
        element={
          <ProtectedRoute role="MANAGER">
            <DevoteeMaster />
          </ProtectedRoute>
        }

      />

      <Route
        path="/DevoteeDirectory"
        element={
          <ProtectedRoute role="MANAGER">
            <DevoteeDirectory />
          </ProtectedRoute>
        }

      />

      <Route
        path="/priests"
        element={
          <ProtectedRoute role="MANAGER">
            <PriestDirectory />
          </ProtectedRoute>
        }

      />

      

       <Route
        path="/admin"
        element={
          <ProtectedRoute role="ADMIN">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />


       <Route
        path="/admin/AssetManager"
        element={
          <ProtectedRoute role="ADMIN">
            <AssetManagement />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/AssetDirectory"
        element={
          <ProtectedRoute role="ADMIN">
            <AssetDirectory/>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/assets/:id"
        element={
          <ProtectedRoute role="ADMIN">
            <AssetDetail/>
          </ProtectedRoute>
        }
      />


       <Route
        path="/admin/config"
        element={
          <ProtectedRoute role="ADMIN">
            <AdminNavbar />
            <AddCategory />
          </ProtectedRoute>
        }
      />

      


      <Route
        path="/admin/PriestMaster"
        element={
          <ProtectedRoute role="ADMIN">
            <PriestMaster />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/BranchMaster"
        element={
          <ProtectedRoute role="ADMIN">
            <TempleBranchMaster />
          </ProtectedRoute>
        }
      />

       <Route
        path="/admin/BranchDetails/:branchId"
        element={
          <ProtectedRoute role="ADMIN">
            <BranchDetail />
          </ProtectedRoute>
        }
      />


      <Route
        path="/admin/BranchDirectory"
        element={
          <ProtectedRoute role="ADMIN">
            <BranchDirectory />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/UserMaster"
        element={
          <ProtectedRoute role="ADMIN">
            <UserManager />
          </ProtectedRoute>
        }
      />


      <Route
        path="/admin/BoardManager/:branchId"
        element={
          <ProtectedRoute role="ADMIN">
            <BoardManager />
          </ProtectedRoute>
        }
      />


       <Route
        path="/admin/BankManager"
        element={
          <ProtectedRoute role="ADMIN">
            <BranchBankingForm />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/BankDetailsView"
        element={
          <ProtectedRoute role="ADMIN">
            <BranchBankingView/>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/EventMaster"
        element={
          <ProtectedRoute role="ADMIN">
            <EventDetailsForm/>
          </ProtectedRoute>
        }
      />


      <Route
        path="/admin/EventDirectory"
        element={
          <ProtectedRoute role="ADMIN">
            <EventDetailsView/>
          </ProtectedRoute>
        }
      />


     <Route
        path="/admin/DocumentMaster"
        element={
          <ProtectedRoute role="ADMIN">
            <DocumentUpload/>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/DocumentDirectory"
        element={
          <ProtectedRoute role="ADMIN">
            <DocumentDirectory/>
          </ProtectedRoute>
        }
      />




      <Route
        path="/admin/documents/:id"
        element={
          <ProtectedRoute role="ADMIN">
            <DocumentDetails/>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/ProjectMaster"
        element={
          <ProtectedRoute role="ADMIN">
            <ProjectRegistry/>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/ProjectDirectory"
        element={
          <ProtectedRoute role="ADMIN">
            <ProjectDirectory/>
          </ProtectedRoute>
        }
      />


      <Route
        path="/devotee/DevoteeMaster"
        element={
          
            <DevoteeRegistration/>
         
        }
      />

       <Route
        path="/devotee/DevoteeWelcome"
        element={
         
            <DevoteeWelcome/>
         
        }
      />

      <Route
        path="/devotee/BookList"
        element={
         
            <BookingDirectory/>
         
        }
      />

      <Route
        path="/admin/PersonnelDashboard"
        element={
          <ProtectedRoute role="ADMIN">
            <PersonnelDashboard/>
          </ProtectedRoute>
        }
      />

      <Route
        path="/BookProperty"
        element={
          <ProtectedRoute role="MANAGER">
            <BookProperty />
          </ProtectedRoute>
        }
      />

    </Routes>

    
  );
}

export default App;
