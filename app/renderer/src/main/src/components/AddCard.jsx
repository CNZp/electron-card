import React, { useEffect, useState, useContext } from "react";
import { Button, Modal, Form, Input, Select, Divider, Row, Col } from "antd";
import AppContext from "../AppContext";
import { PlusOutlined } from "@ant-design/icons";
import ContentEditor from "./ContentEditor";
import BraftEditor from "braft-editor";

export default ({ noBlock }) => {
  const [modalShow, setModalShow] = useState(false);
  const { addCard, types, tags } = useContext(AppContext);

  const [newType, setNewType] = useState("");
  const [newTag, setNewTag] = useState("");

  const [tempTypes, setTempTypes] = useState([]);
  const [tempTags, setTempTags] = useState([]);

  const [form] = Form.useForm();

  useEffect(() => {
    if (modalShow) {
      form.resetFields();
      setTempTypes([...types]);
      setTempTags([...tags]);
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

  const addTempTag = () => {
    let tag = (newTag + "").trim();
    if (tag) {
      let inTag = false;
      tempTags.some((item) => {
        if (item === tag) {
          inTag = true;
          return true;
        }
      });
      if (!inTag) {
        setTempTags((tempTags) => [...tempTags, tag]);
      }
      setNewTag("");
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
            content: BraftEditor.createEditorState(null),
          }}
          size="small"
          form={form}
        >
          <Form.Item
            label="卡片标题"
            labelCol={{ span: 3 }}
            wrapperCol={{ span: 21 }}
            name="title"
            rules={[{ required: true, message: "不可为空" }]}
          >
            <Input placeholder="请输入卡片标题" />
          </Form.Item>
          <Row>
            <Col span={12}>
              <Form.Item
                label="卡片类型"
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 18 }}
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
                          padding: "8px",
                        }}
                      >
                        <Input
                          style={{ flex: "auto", height: "24px" }}
                          value={newType}
                          onChange={(e) => {
                            setNewType(e.target.value);
                          }}
                          onKeyDown={(e) => {
                            e.stopPropagation();
                          }}
                          onPressEnter={(e) => {
                            addTempType();
                            e.stopPropagation();
                          }}
                        />
                        <a
                          style={{
                            flex: "none",
                            display: "block",
                            cursor: "pointer",
                            paddingLeft: "8px",
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
            <Col span={12}>
              <Form.Item
                label="卡片标签"
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 18 }}
                name="tags"
              >
                <Select
                  mode="multiple"
                  placeholder="请选择或增加多个卡片标签"
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
                          style={{ flex: "auto", height: "24px" }}
                          value={newTag}
                          onChange={(e) => {
                            setNewTag(e.target.value);
                          }}
                          onKeyDown={(e) => {
                            e.stopPropagation();
                          }}
                          onPressEnter={(e) => {
                            addTempTag();
                            e.stopPropagation();
                          }}
                        />
                        <a
                          style={{
                            flex: "none",
                            paddingLeft: "8px",
                            display: "block",
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            addTempTag();
                          }}
                        >
                          <PlusOutlined /> 新增项
                        </a>
                      </div>
                    </div>
                  )}
                >
                  {tempTags.map((tag) => (
                    <Select.Option key={tag} value={tag}>
                      {tag}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item wrapperCol={{ span: 24 }} name="content">
            <ContentEditor
              placeholder="请输入卡片内容"
              contentStyle={{ height: "200px", fontSize: "14px" }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
