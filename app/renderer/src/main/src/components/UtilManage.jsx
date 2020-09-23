import React, { useState, useContext, useEffect } from "react";
import { Result, Button, Modal, Space, Form, Input, Select } from "antd";
import { MinusCircleOutlined, PlusOutlined ,AppstoreOutlined} from "@ant-design/icons";
import AppContext from "../AppContext";

const colorOptions = [
  {
    value: "#1890ff",
    label: (
      <div
        style={{
          width: "80px",
          height: "16px",
          background: "#1890ff",
          marginTop: "3px",
        }}
      ></div>
    ),
  },
  {
    value: "#ED5A65",
    label: (
      <div
        style={{
          width: "80px",
          height: "16px",
          background: "#ED5A65",
          marginTop: "3px",
        }}
      ></div>
    ),
  },
  {
    value: "#EC7696",
    label: (
      <div
        style={{
          width: "80px",
          height: "16px",
          background: "#EC7696",
          marginTop: "3px",
        }}
      ></div>
    ),
  },
  {
    value: "#AD6598",
    label: (
      <div
        style={{
          width: "80px",
          height: "16px",
          background: "#AD6598",
          marginTop: "3px",
        }}
      ></div>
    ),
  },
  {
    value: "#815C94",
    label: (
      <div
        style={{
          width: "80px",
          height: "16px",
          background: "#815C94",
          marginTop: "3px",
        }}
      ></div>
    ),
  },
  {
    value: "#1BA784",
    label: (
      <div
        style={{
          width: "80px",
          height: "16px",
          background: "#1BA784",
          marginTop: "3px",
        }}
      ></div>
    ),
  },
  {
    value: "#96C24E",
    label: (
      <div
        style={{
          width: "80px",
          height: "16px",
          background: "#96C24E",
          marginTop: "3px",
        }}
      ></div>
    ),
  },
  {
    value: "#FFC90C",
    label: (
      <div
        style={{
          width: "80px",
          height: "16px",
          background: "#FFC90C",
          marginTop: "3px",
        }}
      ></div>
    ),
  },
  {
    value: "#FFA60F",
    label: (
      <div
        style={{
          width: "80px",
          height: "16px",
          background: "#FFA60F",
          marginTop: "3px",
        }}
      ></div>
    ),
  },
  {
    value: "#F97D1C",
    label: (
      <div
        style={{
          width: "80px",
          height: "16px",
          background: "#F97D1C",
          marginTop: "3px",
        }}
      ></div>
    ),
  },
  {
    value: "#603D30",
    label: (
      <div
        style={{
          width: "80px",
          height: "16px",
          background: "#603D30",
          marginTop: "3px",
        }}
      ></div>
    ),
  },
  {
    value: "#847C74",
    label: (
      <div
        style={{
          width: "80px",
          height: "16px",
          background: "#847C74",
          marginTop: "3px",
        }}
      ></div>
    ),
  },
];

export default () => {
  const [modalShow, setModalShow] = useState(false);
  const { utils, saveUtils } = useContext(AppContext);

  const [form] = Form.useForm();

  useEffect(() => {
    if (modalShow) {
      form.resetFields();
    }
  }, [modalShow]);

  const onStateOk = () => {
    form
      .validateFields()
      .then(() => {
        const newData = form.getFieldsValue();
        saveUtils(newData);
        setModalShow(false);
      })
      .catch(() => {});
  };

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <div>
        <Result
          icon={<AppstoreOutlined />}
          title="点击菜单栏工具以跳转"
          extra={[
            <Button
              type="primary"
              key="console"
              onClick={() => setModalShow(true)}
            >
              工具管理
            </Button>,
          ]}
        />
      </div>
      <Modal
        title={"工具管理"}
        visible={modalShow}
        onOk={onStateOk}
        onCancel={() => setModalShow(false)}
        forceRender
        style={{ width: "100%", height: "100%" }}
      >
        <Form
          className="utilManage"
          initialValues={{
            utils: utils,
          }}
          size="small"
          form={form}
        >
          <Form.List name="utils">
            {(fields, { add, remove }) => {
              return (
                <div style={{ height: "420px" }}>
                  <div style={{ maxHeight: "370px", overflowY: "auto" }}>
                    {fields.map((field) => (
                      <Space
                        key={field.key}
                        style={{ display: "flex" }}
                        align="start"
                      >
                        <Form.Item
                          {...field}
                          label="工具名称"
                          name={[field.name, "name"]}
                          fieldKey={[field.fieldKey, "name"]}
                          rules={[{ required: true, message: "不可为空" }]}
                        >
                          <Input
                            style={{ width: "120px" }}
                            placeholder="请输入"
                          />
                        </Form.Item>
                        <Form.Item
                          {...field}
                          label="链接地址"
                          name={[field.name, "url"]}
                          fieldKey={[field.fieldKey, "url"]}
                          rules={[{ required: true, message: "不可为空" }]}
                        >
                          <Input
                            style={{ width: "320px" }}
                            placeholder="请输入"
                          />
                        </Form.Item>
                        <Form.Item
                          {...field}
                          label="图标颜色"
                          name={[field.name, "color"]}
                          fieldKey={[field.fieldKey, "color"]}
                        >
                          <Select
                            style={{ width: "120px" }}
                            placeholder="请选择"
                            options={colorOptions}
                          />
                        </Form.Item>

                        <MinusCircleOutlined
                          onClick={() => {
                            remove(field.name);
                          }}
                        />
                      </Space>
                    ))}
                  </div>
                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => {
                        add();
                      }}
                      block
                    >
                      <PlusOutlined /> 新增工具
                    </Button>
                  </Form.Item>
                </div>
              );
            }}
          </Form.List>
        </Form>
      </Modal>
    </div>
  );
};
