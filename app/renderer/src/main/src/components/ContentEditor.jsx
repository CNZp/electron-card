import React from 'react'
// 引入编辑器组件
import BraftEditor from 'braft-editor'
// 引入编辑器样式
import 'braft-editor/dist/index.css'

export default (props) => {
        return (
            <div className="my-component" style={{border:"1px solid #333333"}}>
                <BraftEditor 
                    {...props}
                    // onSave={this.submitContent}
                />
            </div>
        )

}