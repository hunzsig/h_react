import React, {Component} from 'react';
import {Button} from 'antd';
import {TranslationOutlined} from '@ant-design/icons';
import {I18n, I18nContainer} from 'h-react-antd';
import LoginForm from './Login/form'
import './Login.less';

class Login extends Component {

  render() {
    return (
      <div className="h-react-login">
        <div className="bg"/>
        <div className="content-wrapper">
          <div className="container">
            <h4 className="tit">{I18n('LOGIN')}</h4>
            <LoginForm/>
          </div>
        </div>
        <I18nContainer placement="right">
          <Button className="tranBtn" icon={<TranslationOutlined/>}>Translate</Button>
        </I18nContainer>
      </div>
    );
  }
}

export default Login;
