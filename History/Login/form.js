import React, {useState} from "react";
import {message, Form, Input, Button, Checkbox} from 'antd';
import {UserOutlined, LockOutlined} from '@ant-design/icons';
import {Api, Auth, History, I18n} from 'h-react-antd/index';
import LocalStorage from "../../Storage/LocalStorage";

export default () => {

  const [formData, setFormData] = useState({
    account: LocalStorage.get('l_acc'),
    password: undefined,
    remember: LocalStorage.get('l_rem') === 1,
    loginStatus: 'free',
  });

  const layout = {
    labelCol: {
      span: 0,
    },
    wrapperCol: {
      span: 24,
    },
  };
  const
    tailLayout = {
      wrapperCol: {
        offset: 0,
        span: 24,
      },
    };

  const onFinish = values => {
    console.log('Success:', values);
    if (formData.loginStatus !== 'free') {
      return;
    }
    setFormData({...formData, loginStatus: 'ing'});
    Api.query().post({ADMIN_LOGIN: values}, (res) => {
      if (res.code === 200) {
        message.success(I18n('LOGIN_SUCCESS'));
        setFormData({...formData, loginStatus: 'ok'});
        if (values.remember === true) {
          LocalStorage.set('l_rem', values.remember ? 1 : 0)
          LocalStorage.set('l_acc', values.account)
        }
        History.setState({
          loggingId: res.data.user_id,
        });
        const t1 = setTimeout(() => {
          window.clearTimeout(t1);
          History.setState({
            logging: true,
          });
          History.efficacy('init');
        }, 1000)
      } else {
        message.error(I18n(res.msg));
        setTimeout(() => {
          setFormData({...formData, loginStatus: 'free'});
        }, 300);
      }
    });
  };

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Form
      {...layout}
      name="login"
      initialValues={formData}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <Form.Item
        name="account"
        rules={[
          {
            required: true,
            message: I18n(['PLEASE_INPUT', 'YOUR', 'ACCOUNT']) + '!',
          },
        ]}
      >
        <Input
          name="account"
          maxLength={20}
          allowClear={true}
          prefix={<UserOutlined style={{color: 'rgba(0,0,0,.25)'}}/>}
          placeholder={I18n(['YOUR', 'ACCOUNT'])}
        />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[
          {
            required: true,
            message: I18n(['PLEASE_INPUT', 'YOUR', 'PASSWORD']) + '!',
          },
        ]}
      >
        <Input.Password
          name="password"
          maxLength={16}
          prefix={<LockOutlined style={{color: 'rgba(0,0,0,.25)'}}/>}
          placeholder={I18n(['YOUR', 'PASSWORD'])}
        />
      </Form.Item>
      <Form.Item>
        <Form.Item {...tailLayout} name="remember" valuePropName="checked" noStyle>
          <Checkbox>{I18n('REMEMBER_ME')}</Checkbox>
        </Form.Item>
        <Button type="link">{I18n('FORGOT_PASSWORD')}</Button>
      </Form.Item>
      <Form.Item {...tailLayout}>
        <Button
          style={{width: '100%'}}
          htmlType="submit"
          // disabled={!formData.account || !formData.password}
          type={formData.loginStatus === 'free' ? 'primary' : formData.loginStatus === 'ok' ? 'secondary' : 'normal'}
          loading={formData.loginStatus !== 'free'}
        >
          {formData.loginStatus === 'free' ? I18n('SUBMIT') : formData.loginStatus === 'ok' ? I18n('LOADING') : I18n('ACCESSING')}
        </Button>
      </Form.Item>
    </Form>
  );
};