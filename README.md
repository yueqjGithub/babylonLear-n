## 感谢大哥的文档
https://doc.cnbabylon.com/2-0-first-steps/
## 官方文档
https://doc.babylonjs.com/journey/theFirstStep

## 坑点记录
1. importMeshAsync, 第一个参数，meshnames，此处对应的是模型文件中已经定义的meshname，可以理解为，到.babylonjs文件中根据meshname找到对应的mesh，然后加载到场景中，如果没有对应mesh，那么加载出来就是一场空。