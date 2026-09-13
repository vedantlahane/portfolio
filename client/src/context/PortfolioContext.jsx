import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_URL } from './AdminContext';

const PortfolioContext = createContext();

export const PortfolioProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAllData = async () => {
    try {
      const [profileRes, projectsRes, skillsRes] = await Promise.all([
        fetch(`${API_URL}/api/profile`),
        fetch(`${API_URL}/api/projects`),
        fetch(`${API_URL}/api/skills`)
      ]);

      if (profileRes.ok) {
        const profileData = await profileRes.json();
        setProfile(profileData);
      }
      if (projectsRes.ok) {
        const projectsData = await projectsRes.json();
        setProjects(projectsData);
      }
      if (skillsRes.ok) {
        const skillsData = await skillsRes.json();
        setSkills(skillsData);
      }
    } catch (err) {
      console.error('Failed to fetch portfolio data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  return (
    <PortfolioContext.Provider value={{
      profile,
      setProfile,
      projects,
      setProjects,
      skills,
      setSkills,
      loading,
      fetchAllData
    }}>
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};
