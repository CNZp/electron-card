import React, { useEffect, useState, useContext } from "react";
import { Button, Modal, Form, Input, Select, Divider, Row, Col } from "antd";
import AppContext from "../AppContext";
import { PlusOutlined } from "@ant-design/icons";
import ContentEditor from "./ContentEditor";
import BraftEditor from "braft-editor";

export default ({ noBlock }) => {
  const [modalShow, setModalShow] = useState(false);
  const { selectType, addCard, clearAllCards, types } = useContext(AppContext);

  const [newType, setNewType] = useState("");
  const [tempTypes, setTempTypes] = useState([]);

  const [form] = Form.useForm();

  useEffect(() => {
    if (modalShow) {
      form.resetFields();
      setTempTypes([...types]);
    }
  }, [modalShow]);

  const onStateOk = () => {
    form
      .validateFields()
      .then(() => {
        const newCard = form.getFieldsValue();
        newCard.content = newCard.content.toHTML();
        addCard(newCard);
        setModalShow(false);
      })
      .catch(() => {});
  };

  const addTempType = () => {
    let type = (newType + "").trim();
    if (type) {
      let inTag = false;
      tempTypes.some((item) => {
        if (item === type) {
          inTag = true;
          return true;
        }
      });
      if (!inTag) {
        setTempTypes((tempTypes) => [...tempTypes, type]);
      }
      setNewType("");
    }
  };

  return (
    <>
      <Button
        icon={<PlusOutlined />}
        type="primary"
        onClick={() => {
          setModalShow(true);
        }}
      >
        <b>新增卡片</b>
      </Button>
      {/* <Button
        type="danger"
        size="small"
        block={!!!noBlock}
        onClick={() => {
          clearAllCards();
        }}
      >
        清空卡片
      </Button> */}
      <Modal
        title={"新增卡片"}
        visible={modalShow}
        onOk={onStateOk}
        onCancel={() => setModalShow(false)}
        forceRender
        style={{ width: "100%", height: "100%" }}
      >
        <Form
          initialValues={{
            type: selectType == "全部" ? null : selectType,
            content: BraftEditor.createEditorState(null),
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
                rules={[{ required: true, message: "不可为空" }]}
              >
                <Select
                  placeholder="请选择或增加卡片类型"
                  dropdownRender={(menu) => (
                    <div>
                      {menu}
                      <Divider style={{ margin: "4px 0" }} />
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "nowrap",
                          padding: 8,
                        }}
                      >
                        <Input
                          style={{ flex: "auto" }}
                          value={newType}
                          onChange={(e) => {
                            setNewType(e.target.value);
                          }}
                        />
                        <a
                          style={{
                            flex: "none",
                            padding: "8px",
                            display: "block",
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            addTempType();
                          }}
                        >
                          <PlusOutlined /> 新增项
                        </a>
                      </div>
                    </div>
                  )}
                >
                  {tempTypes.map((type) => (
                    <Select.Option key={type} value={type}>
                      {type}
                    </Select.Option>
                  ))}
                </Select>
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
