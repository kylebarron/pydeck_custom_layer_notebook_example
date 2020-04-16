## Custom layers for pydeck in Jupyter Notebook

This repo is an example of how to create a custom deck.gl layer for use in pydeck.

### Install

Clone
```
git clone https://github.com/kylebarron/pydeck_custom_layer_notebook_example
cd pydeck_custom_layer_notebook_example
```

Create the conda environment. This installs Jupyter and Jupyter Notebook from
conda-forge and pydeck from pip.
```bash
conda env create -f environment.yml
```

Enter the environment:
```
source activate pydeck_custom_layer_notebook_example
```

Enable Pydeck:
```
jupyter nbextension install --sys-prefix --symlink --overwrite --py pydeck
jupyter nbextension enable --sys-prefix --py pydeck
```

### Build bundle

Build an iife bundle using rollup:
```
yarn install
yarn run build-rollup
```

### Start example notebook:

```
jupyter notebook Example.ipynb
```