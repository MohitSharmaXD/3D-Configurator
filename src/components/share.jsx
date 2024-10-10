import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './share.css';
import customisedDesignService from '../services/customised-design-service';
import toast from 'react-hot-toast';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const SharePage = () => {
  const [imageSrc, setImageSrc] = useState('');
  const [loading, setLoading] = useState(true);
  const query = useQuery();
  const userId = query.get('userId');
  const orderItemId = query.get('orderItemId');

  useEffect(() => {
    const fetchMainDesign = async () => {
      if (userId == 'null' || orderItemId == 'null') {
        setLoading(false);
        toast.error('Malformed URL. Some data is missing!');
        return;
      }

      customisedDesignService.getCustomisedDesign(`userId=${userId}&orderItemId=${orderItemId}&isMainDesign=1`).then((response) => {
        if (response?.error) {
          toast.error(response.error);
          setLoading(false);
        } else {
          setImageSrc(response[0].design);
          setLoading(false);
        }
      });
    };

    fetchMainDesign();
  }, []);

  return (
    <div className='share-page-container'>
      {loading ? (
        <div className='loading'>Loading...</div>
      ) : (
        <img src={imageSrc} alt='Shared Content' className='shared-image' />
      )}
    </div>
  );
};

export default SharePage;
