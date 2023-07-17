import { styled } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import FusePageSimple from '@fuse/core/FusePageSimple';
import DemoContent from '@fuse/core/DemoContent';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { changeLanguage, selectLanguages } from 'app/store/i18nSlice';

const Root = styled(FusePageSimple)(({ theme }) => ({
  '& .FusePageSimple-header': {
    backgroundColor: theme.palette.background.paper,
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderColor: theme.palette.divider,
  },
  '& .FusePageSimple-toolbar': {},
  '& .FusePageSimple-content': {},
  '& .FusePageSimple-sidebarHeader': {},
  '& .FusePageSimple-sidebarContent': {},
}));

function ExamplePage(props) {
  const { t } = useTranslation('examplePage');
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(changeLanguage('tr'));
  }, []);

  return (
    <Root
      header={
        <div className="p-24">
          <h4>{t('TITLE')}</h4>
          <div>{t('title')}</div>
        </div>
      }
      content={
        <div className="p-24">
          <h4>Content</h4>
          <br />
          <DemoContent />
        </div>
      }
      scroll="content"
    />
  );
}

export default ExamplePage;
