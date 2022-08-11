from setuptools import setup, find_packages

with open("requirements.txt") as f:
	install_requires = f.read().strip().split("\n")

# get version from __version__ variable in nsigma/__init__.py
from nsigma import __version__ as version

setup(
	name="nsigma",
	version=version,
	description="Modules for NsigmaERP",
	author="None",
	author_email="dsi@nsigma.fr",
	packages=find_packages(),
	zip_safe=False,
	include_package_data=True,
	install_requires=install_requires
)
