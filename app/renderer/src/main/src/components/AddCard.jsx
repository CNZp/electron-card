import React, { useEffect, useState, useContext } from "react";
import { Button, Modal, Form, Input } from "antd";
import AppContext from "../AppContext";

export default () => {
  const [modalShow, setModalShow] = useState(false);
  const { addCard } = useContext(AppContext);

  const [form] = Form.useForm();

  useEffect(() => {
    if (modalShow) {
      form.resetFields();
    }
  }, [modalShow]);

  function onStateOk() {
    form
      .validateFields()
      .then(() => {
        const newCard = form.getFieldsValue();
        addCard(newCard);
        setModalShow(false);
      })
      .catch(() => {});
  }

  return (
    <>
      <Button
        type="primary"
        size="small"
        block
        onClick={() => {
          setModalShow(true);
        }}
      >
        新增卡片
      </Button>
      <Modal
        title={"新增开片"}
        visible={modalShow}
        onOk={onStateOk}
        onCancel={() => setModalShow(false)}
        forceRender
      >
        <Form initialValues={{}} size="small" form={form}>
          <Form.Item
            label="卡片类型"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            name="type"
            rules={[{ required: true, message: "不可为空" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="卡片标题"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            name="title"
            rules={[{ required: true, message: "不可为空" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="卡片内容"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            name="content"
            rules={[{ required: true, message: "不可为空" }]}
          >
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
