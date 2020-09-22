import React, { useEffect, useState, useContext } from "react";
import { Button, Modal, Form, Input, Row, Col } from "antd";
import AppContext from "../AppContext";
import { EditFilled } from "@ant-design/icons";
import BraftEditor from "braft-editor";
import ContentEditor from "./ContentEditor";

export default ({ oldCard }) => {
  const [modalShow, setModalShow] = useState(false);
  const { editCard } = useContext(AppContext);

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
        const newCard = { ...oldCard, ...form.getFieldsValue() };
        newCard.content = newCard.content.toHTML();
        editCard(newCard);
        setModalShow(false);
      })
      .catch(() => {});
  }

  return (
    <>
      <EditFilled
        style={{ color: "#1890ff", marginRight: "5px" }}
        onClick={() => {
          setModalShow(true);
        }}
      />
      <Modal
        title={"修改卡片"}
        visible={modalShow}
        onOk={onStateOk}
        onCancel={() => setModalShow(false)}
        forceRender
      >
        <Form
          initialValues={{
            ...oldCard,
            content: BraftEditor.createEditorState(oldCard.content),
          }}
          size="small"
          form={form}
        >
          <Row>
            <Col span={8}>
              <Form.Item
                label="卡片类型"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                name="type"
              >
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={16}>
              <Form.Item
                label="卡片标题"
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 18 }}
                name="title"
                rules={[{ required: true, message: "不可为空" }]}
              >
                <Input placeholder="请输入卡片标题" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item wrapperCol={{ span: 24 }} name="content">
            <ContentEditor
              placeholder="请输入卡片内容"
              contentStyle={{ height: "250px", fontSize: "14px" }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
